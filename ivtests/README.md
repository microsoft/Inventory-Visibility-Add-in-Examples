# Inventory Visibility end-to-end test repository

Please notice that running the test by default erases ALL data from current environment. DO NOT run in production

This is the end-to-end test repository for Inventory Visibility. It is written in [Playwright](https://playwright.dev/). You can use cmd tools, or download the official VSCode plugin for the test. 

## Setup

```
cd ivtests
npm i
```
Fill the contents in environments.ts

## Naming conventions

For a group of tests that you'd expect them to run sequentially, do the following namings: 

`[TwoDigitNumber]_[TestName].spec.ts`

## Execution logics: 

In each test file, to begin with, clear all partition data. And clear them again after the test. See `99_template.spec.ts`

## Perf considerations

Likely this will be single threaded - unsure of the recent changes' impact so don't change this yet. 

Split the tests that requires timeout from none-timeout. 