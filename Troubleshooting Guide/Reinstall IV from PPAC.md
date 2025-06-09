# Reinstall IV from PPAC

Although app uninstallation from Power Platform admin center is not supported, there is a workaround to re-trigger the process of app installation (and registration as part of installtion).

1. Sign in to your Azure portal.
    - If you have already installed IV on this environment before, find that app registration for IV on this environment. Check the client secret and if expired, [add a new client secret](https://learn.microsoft.com/entra/identity-platform/quickstart-register-app?tabs=certificate#add-credentials).
    > [!IMPORTANT]
    > Each environment should have its own app registration and cannot share with another environment. Otherwise, you'll see [401 unauthorized errors](401%20unauthorized%20invalid%20token%20issue.md).
    - If you cannot find or don't have the app registration for IV on this environment, [register an new application](https://learn.microsoft.com/entra/identity-platform/quickstart-register-app) and [add a new client secret](https://learn.microsoft.com/entra/identity-platform/quickstart-register-app?tabs=certificate#add-credentials) to Microsoft Entra under your Azure subscription. 
1. Make a note of the **Application (Client) ID**, **Client Secret**, and **Tenant Id** values.
1. Go to Power Platform admin center.
1. On the left panel, select Resources -> Dynamics 365 apps. Find Dynamics 365 Inventory Visibility in the app list and click Manage.
    > [!IMPORTANT]
    > **DO NOT** enter the your environment details page to select Dynamics 365 apps resources. Enter through Resources on the left panel.
![Manage Resources in PPAC](media/ppac-manage-resources.png)
1. Select the target environment. Enter the application Id and tenant Id that are registered from Azure portal (step 1). Agree to the terms of service and click Install.
![Manage IV installation in PPAC](media/ppac-manage-IV-install.png)
1. During installation, the status of IV add-in is shown as Installing. After installation completes, the status will change to Installed.