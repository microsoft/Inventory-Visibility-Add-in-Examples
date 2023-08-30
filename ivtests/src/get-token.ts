// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios from "axios";
import { execSync } from 'child_process';
import { IVEnvironment } from "./interfaces";

export async function GetAADToken(environment: IVEnvironment) {
    const params = new URLSearchParams();
    params.append('client_id', environment.application_id);
    params.append('client_secret', environment.application_secret);
    params.append('scope', "0cdb527f-a8d1-4bf8-9436-b352c68682b2/.default");
    params.append('grant_type', 'client_credentials');

    const url = `https://login.microsoftonline.com/${environment.tenant_id}/oauth2/v2.0/token`;
    const response = await axios.post(url, params);

    if (response.status != 200) {
        throw new Error(`Failed to get token from azure. Status code: ${response.status}`);
    } else {
        return response.data.access_token;
    }
}

export async function GetSecurityServiceToken(environment: IVEnvironment, client_assertion: string) {
    var response = await axios.post(`https://securityservice.${environment.d365_base_domain}/token`, {
        "grant_type": "client_credentials",
        "client_assertion_type": "aad_app",
        "client_assertion": `${client_assertion}`,
        "Scope": `https://inventoryservice.${environment.d365_base_domain}/.default`,
        "Context": `${environment.environment_id}`, // finops env id
        "context_type": "finops-env"
    });

    if (response.status != 200) {
        throw new Error(`Failed to get token from security service. Status code: ${response.status}`);
    } else {
        return response.data.access_token;
    }
}

export function GetDevToken(environmentId: string) {
    const cmdStr = 'powershell.exe -ExecutionPolicy Bypass -File src/getbearertoken.ps1 ' + environmentId;
    const bearerToken = execSync(cmdStr).toString().trim();
    return bearerToken;
}

export async function GetEnvToken(environment: IVEnvironment) {
    const client_assertion = await GetAADToken(environment);
    const access_token = await GetSecurityServiceToken(environment, client_assertion);
    return access_token;
}