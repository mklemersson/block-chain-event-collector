# Block Chain Event Scan

This project is a simple app that scraps some events `FeesCollected` attached to a contract using, initially, the `Polygon` chain.

## Requirements

- Node: version >= 20
- Docker
- Mongodb

## Getting started

Initially copy the `.env.template` file into the files `.env.test` and `.env`

> .env.test is used for tests, we're loading those files using `dotenv` lib

```sh
cp .env.template .env.test
cp .env.template .env
```

### Setup databases

In order to run the tests we need to first spin up the test database with the following commands

```sh
docker compose up -d db db_test
```

> If you change the .env files, make sure to restart the database since the docker compose file uses its information.

### Running

First, update the `.env` file to ensure you have the proper env vars available.

```env
# App
DATABASE_URL="mongodb://127.0.0.1:4000/evt_scan_database"
DATABASE_USER="evt_scan_user"
DATABASE_PASSWORD="evt_scan_pwd"

## Other configs can be kept as it is ...
```

> Make sure your database name, host and port are matching the parameters used in the `docker-compose.yml` file
> it also uses `.env` to help with some settings.

In order to run the app, we can proceed with installing the dependencies and running the start commands:

```sh
#npm install - npm users

pnpm install

pnpm dev:worker

pnpm dev:api

# OR pnpm dev ## this will start both applications
```

#### Worker

The `worker` app will be running in background using an strategy of `polling` events from `https://polygon-rpc.com` and saving the data
into our local mongodb instance.

The `worker` saves the last entry found on the event batches into a collection `job` in order to prevent reading from the oldest/origin again until the latest block
found.

#### API

There is a small `API` using `express` that will be running, if used the command `npm run dev:api`, at the port `3000`.<br/>
Currently, the API contains only `one` endpoint allowing you to retrieve all the `Fee` events collected and saved by the `worker`.

You can fin this endpoint by visiting [http://localhost:3000/api/integrator/xxxxxx/events](http://localhost:3000/api/integrator/xxxxxx/events)

```sh
curl -kS http://localhost:3000/api/integrator/xxxxxx/events
```

### Testing

The tests can be run after setting up the testing database, first we need to update our `.env.test` file with
the connection settings, you can use the following code as an example:

```env
# App
DATABASE_URL="mongodb://127.0.0.1:4004/evt_scan_database_test"
DATABASE_USER="evt_scan_user"
DATABASE_PASSWORD="evt_scan_pwd"

## Other configs can be kept as it is ...
```
