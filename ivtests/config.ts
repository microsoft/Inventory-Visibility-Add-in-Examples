// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { GetDevToken, GetEnvToken } from './src/get-token';
import * as envs from './environments';

export const CurrentEnvironment = envs.myenv;

export const ApiPrefix = "api/environment"
export const IVEndPointPrefix = CurrentEnvironment.iv_endpoint;
export const IVQueryPrefix = `${CurrentEnvironment.iv_endpoint}/${ApiPrefix}/${CurrentEnvironment.environment_id}`

export const TO2 = 120000;
export const TOLong = 600000;

export const Second = 1000;
export const Minute = 60 * Second;
export const Hour = 60 * Minute;


export async function SetToken() {
    switch (CurrentEnvironment.env) {
        case "test":
        case "prod":
            process.env.IV_BEARER_TOKEN = await GetEnvToken(CurrentEnvironment);
            break;
        default:
            throw new Error(`Unknown environment type: ${CurrentEnvironment.env}`);
    }
}

export function GetHeaders() {
    return {
        headers: {
            'Authorization': `bearer ${process.env.IV_BEARER_TOKEN}`
        }
    }
}