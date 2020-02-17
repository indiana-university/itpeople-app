# IT People 

## Setup

Install dependencies
```sh
npm install
```

## Run

Run locally using mock [json-server](https://github.com/typicode/json-server) API endpoints.

```sh
npm run dev
```

### Other run options
```sh
npm run dev:user # permission and authorization rules
npm run dev:admin # admin permissions
npm run dev:slow # slow and random API response times
npm run dev:chaos # random errors (404,403,500, timeouts) to emulate unstable API server
```

## Test

Run tests
```sh
npm run test
```

Run tests whenever changes are made
```sh
npm run tdd
```
