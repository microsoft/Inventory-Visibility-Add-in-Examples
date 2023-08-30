// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { test, expect } from '@playwright/test';
import * as vars from "../config";
import { SRConfig } from '../constants/srconfig';

test.describe.configure({ mode: 'serial' });

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

test("Initialize configuration for soft reservation and add onhands", async ({ request }) => {
    const setConfig = await request.post(
        `${vars.IVQueryPrefix}/configuration/hardupdate`,
        { data: SRConfig, ...vars.GetHeaders() }
    )

    expect(setConfig.ok()).toBeTruthy();
    var d = (new Date()).toDateString();

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
        data: onHandBody,
        ...vars.GetHeaders()
    })

    expect(addOnHand.ok()).toBeTruthy();
});

test("Make soft reservation for 100 pcs when check AFR -- error: only 10 AFR", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBody(100, true),
        ...vars.GetHeaders()
    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    expect(responseBody["statusCode"]).toEqual(500);
});

test("Make soft reservation for 100 pcs when not checkAFR -- OK", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBody(100, false),
        ...vars.GetHeaders()
    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    expect(responseBody["statusCode"]).toEqual(200);
});

test("Unreserve 100 pcs when checkAFR -- failure", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBody(-100, true),
        ...vars.GetHeaders()
    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    expect(responseBody["statusCode"]).toEqual(500);
});

test("Unreserve 100 pcs when not checkAFR -- OK", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBody(-100, false), ...vars.GetHeaders()
    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    expect(responseBody["statusCode"]).toEqual(200);
});

test("Reserve 1 with dimension not in hierarchy -- Error", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBodyWithColor(1, true), ...vars.GetHeaders()
    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    expect(responseBody["statusCode"]).toEqual(400);
});

test("Adjust soft reservation version to V1", async ({ request }) => {
    var newConfig = SRConfig;
    newConfig.reservConfiguration.version = 1;

    const setConfig = await request.post(
        `${vars.IVQueryPrefix}/configuration/hardupdate`,
        {
            data: newConfig, ...vars.GetHeaders()
        }
    )

    expect(setConfig.ok()).toBeTruthy();
});

test("Reserve 1 with dimension not in hierarchy -- OK", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBodyWithColor(1, true), ...vars.GetHeaders()

    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    expect(responseBody["statusCode"]).toEqual(200);
});


test.afterAll(async ({ request }) => {
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

function reservBody(qty: number, afr: boolean) {
    var d = (new Date()).getTime().toString();

    return {
        "id": `reserve-${d}`,
        "organizationId": "org1",
        "productId": "A0001",
        "quantity": qty,
        "quantityDataSource": "@iv",
        "modifier": "@softreserved",
        "ifCheckAvailForReserv": afr,
        "dimensions": {
            "siteId": "1",
            "locationId": "11"
        }
    }
}

function reservBodyWithColor(qty: number, afr: boolean) {
    var d = (new Date()).getTime().toString();

    return {
        "id": `reserve-${d}`,
        "organizationId": "org1",
        "productId": "A0001",
        "quantity": qty,
        "quantityDataSource": "@iv",
        "modifier": "@softreserved",
        "ifCheckAvailForReserv": afr,
        "dimensions": {
            "siteId": "1",
            "locationId": "11",
            "colorId": "",
        }
    }
}