# 401 unauthorized invalid token issue

This page will provide the guide for fixing 401 unauthorized error when posting requests to Inventory Visiblity. 401 error means that your request is unauthorized, which is caused by invalid or expired access token in your request.
> [!NOTE]
> Tokens expire in 1 hour after generation.

## Get 401 unauthorized error in Inventory Visiblity Power App

**Error massage example：**

- Get 401 unauthorized error when you post requests in Inventory Visiblity Power App

![401 unauthorized error in PowerApps](media/401-unauthorized-error-powerapps.png)

**Solution：**

1. Select the **Settings** icon from the top navigation bar. A window will pop up to show your credential information and the current access token used in your request.
1. You will find a warning message under the **Bearer Token** row, telling that "Bearer Token is invalid or expired". Enter valid Client ID, Tenant ID and Client Secret. Then click the **Refresh** button to get a new token.
![bearer token is invalid or expired](media/bearer-token-is-invalid.png)
1. If you get a new token successfully, close the **Settings** window and post your request again to check whether the issue has been resolved.
1. If you cannot get a new token after you click the **Refresh** button, please double check the credential you use and the Environment Id shown in the Settings window.

    - If you find the environment Id is incorrect, please verify whether you have performed any [Database and Dataverse Movement](Database%20and%20Dataverse%20Movement.md) operation. Follow the guide or create a support case for further assistance.
    - If the environment Id is correct, please verify whether you can [get a token from API]((https://learn.microsoft.com/dynamics365/supply-chain/inventory/inventory-visibility-api#inventory-visibility-authentication)). If not, follow the below section [Get 401 unauthorized error in API client](#get-401-unauthorized-error-in-api-client) to try unblock yourself.
    - Create a support case if you need further assistance.

## Get 401 unauthorized error in API client

**Error massage example：**

- Get 401 unauthorized error when you post requests in API client

![401 unauthorized error in Postman](media/401-unauthorized-error-postman.png)

**Solution：**

1. Follow the [Inventory Visiblity Authentication](https://learn.microsoft.com/dynamics365/supply-chain/inventory/inventory-visibility-api#inventory-visibility-authentication) to get a valid access token from API client. **Note that you need to first retrieve a Microsoft Entra token and then retrieve an access token.** If you fail to retrieve a valid token, check the below points.
    - Verify that for each token request, you are using just the **same URL** as written in the document. The expected response format is also provided in the document, which is supposed to be perfectly matched.
    - Sign in to your Azure portal and find the app registration for IV on this environment. Ensure that Client ID and Tenant ID are exactly the values you use when installing IV on this environment. Ensure that Client Secret is not expired.
    > [!IMPORTANT]
    > Each environment should have its own app registration and cannot share with another environment. One of the common causes for 401 unauthorized errors is sharing the same app registration between different environments.
    - If you are on a Production environment and the abovementioned steps didn't help, open a support case.
    - If you are on a Sandbox environment and the abovementioned steps didn't help, try [uninstall IV](https://learn.microsoft.com/dynamics365/supply-chain/inventory/inventory-visibility-setup#uninstall-add-in) from [LCS]((https://lcs.dynamics.com/Logon/Index)) and then reinstall IV to unblock yourself. If this environment doesn't have a LCS project, [reinstall IV from PPAC](Reinstall%20IV%20from%20PPAC.md).
1. Select the Authorization tab, enter the valid **access token** you get from step 1. 
    > [!IMPORTANT]
    > **DO NOT** use the Microsoft Entra token.
![Enter bearer token in Postman](media/enter-token-in-postman.png)
1. Send requests to Inventory visiblity again and check whether the issue has been resolved.