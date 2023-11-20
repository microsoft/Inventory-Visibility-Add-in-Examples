# Previewing Partition by Product settings

This is a quick introduction to help user decide whether Partition by Product feature fits there needs. This feature is at private preview stage. Most of the contents will be moved to official documentations at public preview stages. 

## Business scenario

This feature will allow you to partition by product instead of current site and warehouses, meaning you have the flexibility to not specify site and warehouses information when querying, posting, soft reserving and allocating inventory via Inventory Visibility Service. You can choose whether to partition by product or by site and warehouses depends on your scenarios, for example ecommerce in-basket reservation users will query/update inventory on product level without having accurate warehouse information; while for in-store sales or counting in store, users need to query/reserve inventory specifying site and warehouse information.

## Checklist for feature preview

Below is a list of feature previews to consider: 

1. The preview feature is enabled per `Environment ID`. Enabling this feature in one environment does not trigger the enabling of the feature under the another environment. 
1. The current setup is called `Partition by Location`, where data is stored by different location (warehouse) IDs. Switching between `Partition by Location` and `Partition by Product` requires erasing all data for current environment. 
1. Below operations in `Partition by Location` is not supported by `Partition by Product`: Query without Product ID
1. Below operations can only be done in `Partition by Product`: Inventory updates without site and warehouse

Make sure to understand these changes before proceeding the preview. 

## API usage reference 

See a comprehensive list of API usage reference below: 

[Without Partition by Product](../tests/21_partitionByDimension.spec.ts)

[With Partition by product](../tests/22_partitionByProduct.spec.ts)
