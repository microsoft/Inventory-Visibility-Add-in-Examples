// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { test, expect } from '@playwright/test';
import * as vars from "../config";

test.beforeAll(async ({request}) => {
    test.setTimeout(vars.TO2);

    await vars.SetToken();

    const pidResponse = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, vars.GetHeaders());
    let pids = JSON.parse((await pidResponse.body()).toString());
    console.log({pids});

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

test('API health ping test', async ({ request }) => {
    // Send a request to the API endpoint
    const qResponse = await request.get(`${vars.IVEndPointPrefix}/health/ping`);

    // Assert the response status code
    expect(qResponse.ok()).toBeTruthy();
    expect(qResponse.status()).toBe(200);
});

test.afterAll(async ({request}) => {
    test.setTimeout(vars.TO2);

    const pidResponse = await request.get(`${vars.IVQueryPrefix}/allpartitionids`, vars.GetHeaders());
    let pids = JSON.parse((await pidResponse.body()).toString());
    console.log({pids});

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

