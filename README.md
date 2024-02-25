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

#pnpm dev:api
#pnpm dev ## start both apps the worker and api
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
