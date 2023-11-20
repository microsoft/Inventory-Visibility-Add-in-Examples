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

test("Initialize configuration for soft reservation and add onhands", async ({ request }) => {
    test.setTimeout(120000);

    var newConfig = SRConfig;
    newConfig.reservConfiguration.version = 1;
    newConfig.partitionConfiguration.useDimensions = true;
    newConfig.partitionConfiguration.useProductId = true;
    newConfig.cachePartitionIdVersion = "ByLocationAndProductIdMod64";


    const setConfig = await request.post(
        `${vars.IVQueryPrefix}/configuration/hardupdate`,
        { data: newConfig, ...vars.GetHeaders() }
    )

    expect(setConfig.ok()).toBeTruthy();
    var d = Date.now().toString();

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

test("Add on hand with site and warehouse -- OK", async ({ request }) => {
    var d = Date.now().toString();

    var onHandBody = {
        "id": `${d}`,
        "productid": "A0002",
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

test("Add on hand without site and warehouse -- OK", async ({ request }) => {
    var d = Date.now().toString();

    var onHandBody = {
        "id": `${d}`,
        "productid": "A0003",
        "organizationid": "org1",
        "dimensions": {
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

test("Index query with site-warehouse -- OK", async ({ request }) => {
    var indexQueryBody = {
        "filters": {
            "SiteId": [
                "1"
            ],
            "locationId": [
                "11"
            ],
            "organizationId": [
                "org1"
            ],
            "ProductID": [
                "A0002"
            ]
        },
        "groupByValues": [],
    }

    const q = await request.post(
        `${vars.IVQueryPrefix}/onhand/indexQuery`, {
        data: indexQueryBody, ...vars.GetHeaders()
    })

    expect(q.ok()).toBeTruthy();

    let data = JSON.parse((await q.body()).toString());

    console.log({data});
})

test("Index query without site-warehouse -- OK", async ({ request }) => {
    var indexQueryBody = {
        "filters": {
            "organizationId": [
                "org1"
            ],
            "ProductID": [
                "A0003"
            ]
        },
        "groupByValues": [],
    }

    const q = await request.post(
        `${vars.IVQueryPrefix}/onhand/indexQuery`, {
        data: indexQueryBody, ...vars.GetHeaders()
    })

    expect(q.ok()).toBeTruthy();

    let data = JSON.parse((await q.body()).toString());

    console.log({data});
})

test("Index query without product ID -- OK", async ({ request }) => {
    var indexQueryBody = {
        "filters": {
            "SiteId": [
                "1"
            ],
            "locationId": [
                "11"
            ],
            "organizationId": [
                "org1"
            ],
        },
        "groupByValues": [],
    }

    const q = await request.post(
        `${vars.IVQueryPrefix}/onhand/indexQuery`, {
        data: indexQueryBody, ...vars.GetHeaders()
    })

    expect(q.ok()).toBeTruthy();
})

test("Exact query with site-warehouse -- OK", async ({ request }) => {
    var exactQuery = {
        "filters": {
            "dimensions": [
                "siteid",
                "locationid"
            ],
            "organizationId": [
                "org1"
            ],
            "productId": [
                "A0002"
            ],
            "values": [
                [
                    "1",
                    "11"
                ]
            ]
        },
    }

    const q = await request.post(
        `${vars.IVQueryPrefix}/onhand/exactQuery`, {
        data: exactQuery, ...vars.GetHeaders()
    })

    expect(q.ok()).toBeTruthy();
})

test("Exact query without site-warehouse -- Error", async ({ request }) => {
    var exactQuery = {
        "filters": {
            "dimensions": [
            ],
            "organizationId": [
                "org1"
            ],
            "productId": [
                "A0003"
            ],
            "values": [
                [
                ]
            ]
        },
    }

    const q = await request.post(
        `${vars.IVQueryPrefix}/onhand/exactQuery`, {
        data: exactQuery, ...vars.GetHeaders()
    })

    expect(q.ok()).toBeFalsy();
})

test("Exact query without product ID -- OK", async ({ request }) => {
    var exactQuery = {
        "filters": {
            "dimensions": [
                "siteid",
                "locationid"
            ],
            "organizationId": [
                "org1"
            ],
            "values": [
                [
                    "1",
                    "11"
                ]
            ]
        },
    }

    const q = await request.post(
        `${vars.IVQueryPrefix}/onhand/exactQuery`, {
        data: exactQuery, ...vars.GetHeaders()
    })

    expect(q.ok()).toBeTruthy();
})

test("Reserve 1 with site and warehouse when partition by dimensions -- OK", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBodyWithSiteWarehouse(1, true), ...vars.GetHeaders()
    })

    expect(reserve.status()).toBe(200);
});

test("Reserve 1 without site and warehouse when partition by dimensions -- Error", async ({ request }) => {
    const reserve = await request.post(
        `${vars.IVQueryPrefix}/onhand/reserve`, {
        data: reservBodyWithoutSiteWarehouse(1, true), ...vars.GetHeaders()
    })

    var responseBody = JSON.parse((await reserve.body()).toString());
    console.log({ responseBody });
    expect(responseBody["statusCode"]).toEqual(500);
});

test("Allocate 1 with site and warehouse -- OK", async ({ request }) => {
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

    expect(allocateBody.processingStatus).toBe("success");
});

test("Allocate 1 without site and warehouse -- Error", async ({ request }) => {
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
        }
    }

    const allocate = await request.post(
        `${vars.IVQueryPrefix}/allocation/allocate`, {
        data: allocationRequestBody, ...vars.GetHeaders()
    });

    var allocateBody = JSON.parse((await allocate.body()).toString());

    expect(allocateBody.processingStatus).toBe("failure");
});

test("Schedule 1 piece 3 days later -- OK", async ({ request }) => {
    var scheduleRequestBody = scheduleBody(3, true);

    const schedule = await request.post(
        `${vars.IVQueryPrefix}/onhand/changeschedule`, {
        data: scheduleRequestBody, ...vars.GetHeaders()
    });

    var scheduleResponseBody = JSON.parse((await schedule.body()).toString());
    console.log({scheduleRequestBody});
    console.log({scheduleResponseBody});

    expect(schedule.status()).toBe(200);
});

test("Schedule 1 piece 3 days later without site warehouse -- OK", async ({ request }) => {
    var scheduleRequestBody = scheduleBody(3, false);

    const schedule = await request.post(
        `${vars.IVQueryPrefix}/onhand/changeschedule`, {
        data: scheduleRequestBody, ...vars.GetHeaders()
    });

    expect(schedule.status()).toBe(200);
});

test.afterAll(async ({ request }) => {
    test.setTimeout(vars.TO2);

    const pidResponse = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, {...vars.GetHeaders()});
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

function reservBodyWithSiteWarehouse(qty: number, afr: boolean) {
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

function reservBodyWithoutSiteWarehouse(qty: number, afr: boolean) {
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
        }
    }
}

function scheduleBody(d: number, useSiteWarehouse: boolean) {
    var dl = daysLater(d);
    var id = (new Date()).getTime().toString();
    var requestBody =
    {
        "id": `${id}`,
        "organizationId": "org1",
        "productId": "A0001",
        "dimensions": {
            "SiteId": "1",
            "LocationId": "11"
        },
        "QuantitiesByDate":
        {
            [dl]:
            {
                "iv": {
                    "onhand": 1,
                },
            }
        }
    }

    return requestBody;
}


function daysLater(d: number) {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + d));

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

let jsonList: any[] = [];
