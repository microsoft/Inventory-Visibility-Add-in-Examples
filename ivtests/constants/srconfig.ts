// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// This is a sample configuration, replace with the active configuration from GET /configuration
export const SRConfig =
{
    "environmentId": "1b3ee7f1-f8c6-4654-b889-dfc0c84faf60",
    "isUninstalled": false,
    "configurationVersion": 31,
    "indexConfiguration": {
        "version": 0,
        "partitionKeyAttributes": {
            "setNumber": 0,
            "keys": [
                "siteid",
                "locationid"
            ]
        },
        "indexAttributeSets": [
            {
                "setNumber": 2,
                "keys": [
                    "colorid"
                ]
            }
        ]
    },
    "inventorySystemConfigurations": {
        "fno": {
            "dataSourceName": "fno",
            "dimensionMappings": {
                "inventbatchid": "batchid",
                "inventcolorid": "colorid",
                "inventlocationid": "locationid",
                "inventserialid": "serialid",
                "inventsiteid": "siteid",
                "inventsizeid": "sizeid",
                "inventstatusid": "statusid",
                "inventstyleid": "styleid",
                "licenseplateid": "licenseplateid",
                "wmslocationid": "wmslocationid",
                "wmspalletid": "wmspalletid",
                "configid": "configid",
                "inventversionid": "versionid",
                "inventdimension1": "customdimension1",
                "inventdimension2": "customdimension2",
                "inventdimension3": "customdimension3",
                "inventdimension4": "customdimension4",
                "inventdimension5": "customdimension5",
                "inventdimension6": "customdimension6",
                "inventdimension7": "customdimension7",
                "inventdimension8": "customdimension8",
                "inventdimension9": "customdimension9",
                "inventdimension10": "customdimension10",
                "inventdimension11": "customdimension11",
                "inventdimension12": "customdimension12"
            },
            "physicalMeasures": [
                "notspecified",
                "arrived",
                "availordered",
                "availphysical",
                "deducted",
                "onorder",
                "ordered",
                "physicalinvent",
                "picked",
                "postedqty",
                "quotationissue",
                "quotationreceipt",
                "received",
                "registered",
                "reservordered",
                "reservphysical",
                "orderedsum"
            ],
            "calculatedMeasures": {},
            "reservMappings": {}
        },
        "diff": {
            "dataSourceName": "diff",
            "dimensionMappings": {},
            "physicalMeasures": [],
            "calculatedMeasures": {},
            "reservMappings": {}
        },
        "iv": {
            "dataSourceName": "iv",
            "dimensionMappings": {},
            "physicalMeasures": [
                "onhand"
            ],
            "calculatedMeasures": {},
            "reservMappings": {}
        },
        "pos": {
            "dataSourceName": "pos",
            "dimensionMappings": {},
            "physicalMeasures": [
                "inbound",
                "outbound"
            ],
            "calculatedMeasures": {},
            "reservMappings": {}
        },
        "@iv": {
            "dataSourceName": "@iv",
            "dimensionMappings": {},
            "physicalMeasures": [
                "@softreserved",
                "@allocated",
                "@consumed",
                "@cumulative_allocated",
                "@cumulative_consumed"
            ],
            "calculatedMeasures": {
                "@available_to_reserve": {
                    "additionModifiers": [
                        "iv.onhand"
                    ],
                    "subtractionModifiers": [
                        "@iv.@softreserved"
                    ]
                },
                "@available_to_allocate": {
                    "additionModifiers": [
                        "iv.onhand"
                    ],
                    "subtractionModifiers": [
                        "@iv.@allocated"
                    ]
                }
            },
            "reservMappings": {
                "@softreserved": "@iv.@available_to_reserve"
            }
        },
        "jigua": {
            "dataSourceName": "jigua",
            "dimensionMappings": {},
            "physicalMeasures": [],
            "calculatedMeasures": {},
            "reservMappings": {}
        },
        "sda": {
            "dataSourceName": "sda",
            "dimensionMappings": {
                "testbatchid": "batchid",
                "testcolorid": "colorid"
            },
            "physicalMeasures": [],
            "calculatedMeasures": {},
            "reservMappings": {}
        }
    },
    "isIndexUpgradeInProgress": false,
    "defaultDimensions": {},
    "cachePartitionIdVersion": "byProductId",
    "finOpsConfiguration": {
        "isEnabled": true,
        "isSetup": true
    },
    "isWHSEnabled": false,
    "whsConfiguration": {
        "isEnabled": false,
        "isSetup": true,
        "isTruncatedWHSHierarchyEnabled": true,
        "isTruncatedWHSHierarchySetup": true
    },
    "isPartitionLockEnabled": false,
    "partitionLockConfiguration": {
        "isEnabled": false,
        "isSetup": false
    },
    "storageConfiguration": {
        "isOnHandMostSpecificStorageEnabled": false,
        "version": 0,
        "ohmsBackgroundServiceFreq": 15,
        "isEnabled": false,
        "isSetup": false
    },
    "onHandIndexQueryPreloadStorageConfiguration": {
        "isOnHandIndexQueryPreloadStorageEnabled": true,
        "version": 0,
        "groupByValues": [
            "colorid"
        ],
        "isEnabled": true,
        "isSetup": true
    },
    "scheduleConfiguration": {
        "indexAttributeSets": [
            {
                "setNumber": 1,
                "keys": [
                    "colorid",
                    "sizeid"
                ]
            }
        ],
        "atpCalculatedMeasures": {
            "@iv": {
                "@available_to_reserve": 7
            }
        },
        "version": 2,
        "schedulePeriodInDays": 30,
        "isScheduleEnabled": true,
        "isEnabled": true,
        "isScheduleV2": true,
        "isSetup": true
    },
    "reservConfiguration": {
        "isReservEnabled": true,
        "version": 0,
        "keys": [
            "siteid",
            "locationid"
        ],
        "isEnabled": true,
        "isSetup": true
    },
    "allocationConfiguration": {
        "isEnabled": true,
        "isSetup": true,
        "groups": [
            "channel",
            "customerGroup",
            "region",
            "orderType",
            "df"
        ],
        "groupsOrder": {
            "channel": "g0",
            "customerGroup": "g1",
            "region": "g2",
            "orderType": "g3",
            "df": "g4"
        },
        "availableToAllocateCalculation": {
            "iv.onhand": "addition",
            "@iv.@allocated": "subtraction"
        }
    },
    "entityVersion": 1,
    "partitionConfiguration": {
        "useProductId": true,
        "useDimensions": false
    }
}