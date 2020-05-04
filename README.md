# farmify

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/48887ccc2f374550ab2c328c3f7c7f4d)](https://app.codacy.com/gh/BuildForSDG/farmify?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDG/farmify&utm_campaign=Badge_Grade_Settings)

A project to double productivity of rural farmers

## Installing and running locally

Clone the repository

At the root of the repo run `yarn install -W` to install overall dependencies

To work on the Frontend

From the cloned directory navigate to `packages/farmify-frontend` 
Then run `yarn install`

To work on the Backend

From the cloned directory navigate to `packages/farmify-server` 
Then run `yarn install`

## Test Files

Ensure to write unit tests for all components or functions 
All test files must be named in the form `filename.test.js`

### Running Test

To run tests navigate to the root of the repo and run `yarn run test`

## Deploying Frontend to Production

To deploy to production run `npm install -g firebase-tools`

Navigate in your terminal to  `farmify-frontend` folder

Run `firebase login` and login with the project credentials

Run `yarn run deploy`