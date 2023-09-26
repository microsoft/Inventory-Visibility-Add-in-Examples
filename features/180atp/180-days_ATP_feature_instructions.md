# How to use 180-days ATP

## Introduction

180-days ATP is a more powerful version of the previous 7-days ATP feature.  
It allows you to schedule on-hand changes and calculate available-to-promise (ATP) for up to 180 days in advance.

## Turning on the feature

By default, the ATP feature is limited to 7 days.  
To turn on the 180-days ATP feature, follow these steps:

1. Turn on the ATP feature.
2. Turn on the 180-days ATP feature.
3. Update Configuration.

<img src="./ATP%20Feature%20Switch.png" alt="ATP feature settings" style="width:30%">  

<div style="background-color: #e6f3ff; padding: 10px; border-radius: 10px;">
<strong>Tips:</strong><br>
1. 180-days ATP is only supported when entity version is 2.<br>
If you are using Legacy UI, we will soon provide a help doc about how to upgrade your entity version and migrate your ATP configuration.<br>
<br>
2. Please note that the 7-day ATP and 180-days ATP features are separate and independent from each other. Any schedule changes created or modified using the 7-day ATP feature will not take effect when the 180-day ATP feature is turned on.
</div>

## Configuring the feature

There are three settings you should configure for the ATP feature:

1. Max Schedule Period (Days):  
   This is how long you can schedule changes for. The maximum value for this field is 180 days.  
   By default, it is set to 30 days, which means you can schedule changes for up to 30 days from today.

2. Schedule Measures: <br>
   Schedule Measures could be an existing calculated measure or you can create a new calculated measure.  
   The ATP value will be provided for defined calculated measures, based on the scheduled changes of component physical measures.

   <img src="./Schedule%20Measures.png" alt="Schedule Measures Configuration" style="width:85%">  

3. ATP Index Set Configuration:  
   This setting is similar to the "Product Index Hierarchy" which allows you to group your query results by specific dimensions.  
   For example, if you set ColorId and SizeId as your ATP Index Set, your query results will be grouped by color and size.  
   It is allowed to have multiple index sets.

   <img src="./ATP%20Index%20Set%20Configuration.png" alt="ATP Index Set Configuration" style="width:85%">

## Related Api and Examples

The ATP feature offers multiple APIs which can generally be divided into two main categories.

1. Posting quantity changes with a specific date.  
   This means adding or subtracting the amount of a particular measure on a certain date.

2. Querying the scheduled quantity and ATP value within a specific time range.  
   This means getting information about how much of a resource is scheduled to be used or delivered during this period and also the ability to promise.


#### List of ATP related Api

For all IV Api:
```
Headers:
    Api-Version="1.0"
    Authorization="Bearer $access_token"
ContentType:
    application/json
```

Path	|Method|	Description | Example
| -------- | -------- | -------- | ------- |
/api/environment/{environmentId}/onhand/changeschedule|POST|Create one scheduled on-hand change.|[View Example](./apibodyexamples/changeschedule.json)
/api/environment/{environmentId}/onhand/changeschedule/bulk|POST|Create multiple scheduled on-hand changes.|[View Example](./apibodyexamples/changeschedulebulk.json)
|  |  |  |  |
/api/environment/{environmentId}/onhand/indexquery|POST|Query by using the POST method.|[View Example](./apibodyexamples/indexquery.json)
/api/environment/{environmentId}/onhand|GET|Query by using the GET method.|[View Example](./apibodyexamples/query_by_GET.txt)
/api/environment/{environmentId}/onhand/exactquery|POST|Exact query by using the POST method.|[View Example](./apibodyexamples/exactquery.json)

<br>

<div style="background-color: #e6f3ff; padding: 10px; border-radius: 10px;">
<strong>Tips: How to query 180-days ATP</strong><br>
The scheduled changes are structured and organized by index set, so you <strong>must use one of your index sets in the GroupByValues</strong> section of your query.<br>
Please note this has to be perfect match, thus do not add or miss dimensions to avoid query failure. <br>
When you have multiple index sets, you can query by any of them. But do not mix. <br>
<strong>Filters section should only contain dimensions from Partition Configuration and ATP Index Set Configuration.</strong>
</div>

## Query On UI & Result Example

<img src="./ATP%20Query.png" alt="ATP query" style="width:100%">  