// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface IVEnvironment {
    env: string,
    name: string,
    environment_id: string,
    tenant_id: string,
    application_id: string,
    application_secret: string,
    iv_endpoint: string,
    dataverse_url: string,
    d365_base_domain: string,
}