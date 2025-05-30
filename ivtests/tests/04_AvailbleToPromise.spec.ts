// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { test, expect } from '@playwright/test';
import * as vars from "../config";
import { SRConfig } from '../constants/srconfig';

test.beforeAll(async ({ request }) => {
    test.setTimeout(vars.TO2);

    await vars.SetToken();

    const pidResponse = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, vars.GetHeaders());
    let pids = JSON.parse((await pidResponse.body()).toString());

    for (const pid of pids) {
        const deleteResponse = await request.delete(`${vars.IVQueryPrefix}/partitions/cleanupalldata`, {
            ...vars.GetHeaders(),
            data: [pid]
        });

        if (deleteResponse.ok()) {
            console.log(`Successfully deleted partition ID: ${pid}`);
        } else {
            console.log(`Failed to delete partition ID: ${pid}`);
        }
    }

    const pidResponseAfterDel = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, vars.GetHeaders());

    expect(pidResponseAfterDel.ok()).toBeTruthy();

    let data = JSON.parse((await pidResponseAfterDel.body()).toString());
    expect(data).toEqual([]);
})

test("Initialize configuration for atp and add onhands for 10 pieces", async ({ request }) => {
    const setConfig = await request.post(
        `${vars.IVQueryPrefix}/configuration/hardupdate`,
        { data: SRConfig, ...vars.GetHeaders() }
    )

    expect(setConfig.ok()).toBeTruthy();
    var d = (new Date()).getTime().toString();

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 4);
    var scheduleDate = currentDate.toDateString();

    var onHandChangeScheduleBody = {
        "id": `${d}`,
        "productid": "A0001",
        "organizationid": "org1",
        "dimensions": {
            "siteid": "1",
            "locationid": "11",
        },
        "quantitiesByDate":
        {
            [scheduleDate]: {
                "iv": {
                    "onhand": "10"
                }
            }
        }
    }

    const addOnHandChangeSchedule = await request.post(
        `${vars.IVQueryPrefix}/onhand/changeschedule`, {
        data: onHandChangeScheduleBody, ...vars.GetHeaders()
    })

    expect(addOnHandChangeSchedule.ok()).toBeTruthy();
});

test("Post bulk onhand change schedules -- OK", async ({ request }) => {
    var d = (new Date()).getTime().toString();

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 4);
    var scheduleDate = currentDate.toDateString();

    var bulkOnhandChangeScheduleBody =
        [
            {
                "id": `${d}-1`,
                "productid": "A0001",
                "organizationid": "org1",
                "dimensions": {
                    "siteid": "1",
                    "locationid": "11",
                },
                "quantitiesByDate":
                {
                    [scheduleDate]: {
                        "iv": {
                            "onhand": "10"
                        }
                    }
                }
            },

            {
                "id": `${d}-2`,
                "productid": "A0002",
                "organizationid": "org1",
                "dimensions": {
                    "siteid": "2",
                    "locationid": "24",
                },
                "quantitiesByDate":
                {
                    [scheduleDate]: {
                        "iv": {
                            "onhand": "20"
                        }
                    }
                }
            }
        ]

    const postBulkOhcsResult = await request.post(
        `${vars.IVQueryPrefix}/onhand/changeschedule/bulk`, {
        data: bulkOnhandChangeScheduleBody, ...vars.GetHeaders()
    });

    var responseBody = JSON.parse((await postBulkOhcsResult.body()).toString());
    console.log({ responseBody });

    expect(responseBody["failure"]).toHaveLength(0);
});

test("Query Scheduled Change and ATP quantities -- OK", async ({ request }) => {

    var currentDate = new Date();
    var fromDate = currentDate.toDateString();
    currentDate.setDate(currentDate.getDate() + 10);
    var toDate = currentDate.toDateString();

    var ATPQueryBody =
    {
        "filters": {
            "organizationId": [
                "org1"
            ],
            "productId": [
                "A0001", "A0002"
            ]
        },
        "groupByValues": [
            "ColorId",
            "SizeId"
        ],
        "returnNegative": true,
        "QueryATP": true,
        "atpFromDate": fromDate,
        "atpToDate": toDate
    }

    const queryResponse = await request.post(
        `${vars.IVQueryPrefix}/indexquery`, {
        data: ATPQueryBody, ...vars.GetHeaders()
    });

    var queryResponseBody = JSON.parse((await queryResponse.body()).toString());
    console.log({ queryResponseBody });

    expect(queryResponse.ok()).toBeTruthy();
});

test.afterAll(async ({ request }) => {
    test.setTimeout(vars.TO2);

    const pidResponse = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, { ...vars.GetHeaders() });
    let pids = JSON.parse((await pidResponse.body()).toString());
    console.log({ pids })

    await request.delete(`${vars.IVQueryPrefix}/cleanupalldata`,
        { data: pids, ...vars.GetHeaders() }
    )

    const pidResponseAfterDel = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, { ...vars.GetHeaders() });

    expect(pidResponseAfterDel.ok()).toBeTruthy();

    let data = JSON.parse((await pidResponseAfterDel.body()).toString());
    expect(data).toEqual([]);
})

