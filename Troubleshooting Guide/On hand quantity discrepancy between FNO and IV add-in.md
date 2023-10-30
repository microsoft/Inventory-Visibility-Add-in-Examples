# On hand quantity discrepancy between FNO and IV add-in

This page will provide the guide to troubleshoot and fix the known on hand quantity discrepancy issues between FNO and IV add-in.

## Empty query result shown in IV PowerApps query page

1. If you get 401 undefined error in IV PowerApps query page, this is caused by using invalid token to send query request to IV. Please follow the section [401 unauthorized invalid token issue](./401%20unauthorized%20invalid%20token%20issue.md) to fix the issue.

1. If you get empty query result in IV PowerApps query page, there are serveral potential reasons to cause this issue. Please follow the below guide to check:

    - Check the query parameters, especially the OrganizationId, SiteId, LocationId, ProductId. If you enter incorrect query filter values, the Inventory service will return empty result if IV cannot find it.
    - Please make sure that the endpoint used in the IV PowerApps and in FNO IV parameters page are the same one, otherwise you may get unexpected quantity discrepancy issue. This is because that IV needs to make sure all requests are sent to the same cache instance in the same island at the same time.
    - Pleae check FNO IV Batch Job page, to see whether the records needed to post to IV has decreased to 0, if it doesn't decrease, which means that all on hand change requests from FNO failed to sync to IV, so the query result in IV will be empty. You need to check whether you use correct endpoint in FNO to make sure that on hand change requests can be synced to IV from FNO side successfully.

## Only four fields(AvailOrdered, AvailPhysical, ReservOrdered, ReservPhysical) on hand results are incorrect

If you find that only some items have quantity discrepancy issue and the quantity discrepancy **only happens on four fields(AvailOrdered, AvailPhysical, ReservOrdered, ReservPhysical)**, it most likely is caused by Advance WHS feature is not enabled correctly.

**Solution**

1. If you don't enable Advance WHS feature before, please follow the public document [Inventory Visibility support for WMS items](https://learn.microsoft.com/en-us/dynamics365/supply-chain/inventory/inventory-visibility-whs-support) to enable WHS feature.
1. If you have already enabled advance WHS feateure in FNO side, please go to FNO side to check FNO IV Batch Job page, to see whether the WHS records needed to post IV has decreased to 0. If it doesn't decrease, it most likely is caused by that Advanced WHS Feature in IV Service side doesn't enable correctly. Please go to IV PowerApps side Feature management page, to enable Advanced WHS feature, please remember to **click update configuration button to make it take effect**. If you only turn on the Advanced WHS feature in Feature management page, but without updating the configuration, it will only change the draft configuration, the configuration changes will not take effect in service side.
1. If you have already enabled Advance WHS feature both in FNO and IV side, and the WHS records has decreased to 0, but you still face the quantity discrepancy issue. This maybe be caused by some known issues, which we have published the hotfix, please check and apply the hotfix in your environment.

### some WHS feature related hotfix for FNO side

If you have already enabled Advance WHS feature both in FNO and IV side, and the WHS records has decrease to 0, but you still face the quantity discrepancy issue. This maybe be caused by some known issues, which we have published the hotfix, please check and apply the hotfix in your environment. Below table is the hotfix version for different FNO version.

| AX version | Fix build version |
|--|--|
| 10.0.32 | 10.0.1515.118 |
| 10.0.33 | 10.0.1549.89 |
| 10.0.34 | 10.0.1591.56 |
| 10.0.35 | 10.0.1627.15 |

## All fields may have incorrect quantity result

If your environment has incorrect quantity for all fields, please confirm whether you enable and disable IV batch job again during you use IV add-in. If you indeed did this without setting ```Resync before initial push```  to Yes in Inventory Visibility integration parameter page on the **General** tab, IV will lose some on hand change requests for the items which is closed during you disable IV batch job and reenable it.
Here are two cases:

- If you environment is Sandbox environment, we would suggest you that you can follow the below guide to resync FNO related data, it will make sure that you get latest FNO on hand result in IV side.
- If you enviornment is PROD environment, please contact Inventory Visibility product team at ```inventvisibilitysupp@microsoft.com``` before you take any actions on your PROD environment, we will check your data and configuration to help you fix the issue and prevent it happen again.

### Guide to resync FNO related data

1. Go to FNO side.
1. Go to **Inventory Management \> Periodic Tasks \> Inventory Visibility integration**. If the **Status** value is *Enabled*, disable the job by selecting **Disable** on the Action Pane.
1. Go to **Inventory Management \> Setup \> Inventory Visibility integration parameters**.
1. On the **General** tab, set the **Resync before initial push** option to *Yes*.
1. On the Action Pane, select **Save**.
1. Go to **Inventory Management \> Periodic Tasks \> Inventory Visibility integration**.
1. On the Action Pane, select **Enable** to reenable the batch job.

The initial push with the `Resync` action will first clean up legacy Supply Chain Management data in Inventory Visibility service. It will then resync the `InventSum` and `WHSInventReserve` tables to the Inventory Visibility Service.
