# IT People 

## Setup

Install dependencies
```sh
yarn
```

## Run

Run locally using mock [json-server](https://github.com/typicode/json-server) API endpoints.

```sh
yarn dev
```

### Other run options
```sh
yarn dev-user # permission and authorization rules
yarn dev-admin # admin permissions
yarn dev-slow # slow and random API response times
yarn dev-chaos # random errors (404,403,500, timeouts) to emulate unstable API server
```

## Test

Run tests
```sh
yarn test
```

Run tests whenever changes are made
```sh
yarn tdd
```
