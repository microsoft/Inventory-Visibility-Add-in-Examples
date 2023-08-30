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

test("Initialize configuration for allocation and add onhands for 10 pieces", async ({ request }) => {
    const setConfig = await request.post(
        `${vars.IVQueryPrefix}/configuration/hardupdate`,
        { data: SRConfig, ...vars.GetHeaders() }
    )

    expect(setConfig.ok()).toBeTruthy();
    var d = (new Date()).getTime().toString();

    var onHandBody = {
        "id": `${d}`,
        "productid": "A0001",
        "organizationid": "org1",
        "dimensions": {
            "siteid": "1",
            "locationid": "11"
        },
        "quantities":
        {
            "iv": {
                "onhand": "10"
            }
        }
    }

    // Add 10 to iv.onhand
    // @available_to_reserve is iv.onhand - reserved
    const addOnHand = await request.post(
        `${vars.IVQueryPrefix}/onhand/`, {
        data: onHandBody, ...vars.GetHeaders() 
    })

    expect(addOnHand.ok()).toBeTruthy();
});

test("Send allocation request with 5 pieces -- OK", async ({ request }) => {
    var d = (new Date()).getTime().toString();

    var allocationRequestBody = {
        "id": `${d}`,
        "productId": "A0001",
        "dimensionDataSource": "iv",
        "groups": {
            "channel": "web",
            "customerGroup": "VIP",
        },
        "quantity": 5,
        "organizationId": "org1",
        "dimensions": {
            "siteid": "1",
            "locationid": "11",
        }
    }

    const allocate = await request.post(
        `${vars.IVQueryPrefix}/allocation/allocate`, {
        data: allocationRequestBody, ...vars.GetHeaders() 
    });

    var allocateBody = JSON.parse((await allocate.body()).toString());
    console.log({allocateBody});

    expect(allocate.ok()).toBeTruthy();
});

test("Unallocate 2 pieces -- OK", async ({ request }) => {
    var d = (new Date()).getTime().toString();

    var allocationRequestBody = {
        "id": `${d}`,
        "productId": "A0001",
        "dimensionDataSource": "iv",
        "groups": {
            "channel": "web",
            "customerGroup": "VIP",
        },
        "quantity": 2,
        "organizationId": "org1",
        "dimensions": {
            "siteid": "1",
            "locationid": "11",
        }
    }

    const allocate = await request.post(
        `${vars.IVQueryPrefix}/allocation/unallocate`, {
        data: allocationRequestBody, ...vars.GetHeaders() 
    });

    var allocateBody = JSON.parse((await allocate.body()).toString());
    console.log({allocateBody});

    expect(allocate.ok()).toBeTruthy();
});



test.afterAll(async ({ request }) => {
    test.setTimeout(vars.TO2);

    const pidResponse = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, {...vars.GetHeaders() });
    let pids = JSON.parse((await pidResponse.body()).toString());
    console.log({ pids })

    await request.delete(`${vars.IVQueryPrefix}/cleanupalldata`,
        { data: pids, ...vars.GetHeaders() }
    )

    const pidResponseAfterDel = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, {...vars.GetHeaders()});

    expect(pidResponseAfterDel.ok()).toBeTruthy();

    let data = JSON.parse((await pidResponseAfterDel.body()).toString());
    expect(data).toEqual([]);
})

