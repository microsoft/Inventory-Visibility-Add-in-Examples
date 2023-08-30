// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IVEnvironment } from "./src/interfaces";

const myenv: IVEnvironment = {
    env: "prod",
    name: "myenv",
    environment_id: "",
    tenant_id: "",
    application_id: "",
    application_secret: "",
    iv_endpoint: "https://inventoryservice.{}.gateway.prod.island.powerapps.com",
    dataverse_url: "https://{}.crm{}.dynamics.com",
    d365_base_domain: "operations365.dynamics.com",
}

export {
    myenv
};