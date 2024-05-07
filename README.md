# Azle REST API with ckBTC Integration

This boilerplate is designed to easily build ExpressJS applications usin ckBTC (a Bitcoin pair) on ICP.

## Features

- Build REST API on chain
- Work with SQL databases
- Persist database on chain
- Make ckBTC transactions

## Run Locally

Clone the project

```bash
  git clone https://github.com/adrian-d-hidalgo/azle-api-rest-ckbtc
```

Go to the project directory

```bash
  cd azle-api-rest-ckbtc
```

Install dependencies

```bash
  npm install
```

```bash
# only for mac
codesign -s - .bitcoin/bin/bitcoind
```

```bash
npm run btc:start
```

In another terminal run:

```bash
npm run icp:start
```

Open another terminal and run:

```bash
npm run icp:deploy:local
```

# How to mint ckBTC

Run the following command:

```bash
# only for mac
codesign -s - .bitcoin/bin/bitcoin-cli
```

```bash
# Run three times this command, but wait 1 second between each exacution
npm run btc:mint --address=$ADDRESS
```

Wait for 5 around seconds and make a request to `PUT /users/:userId/balance`

Then, you can verify the user balance in this endpoint: `GET /users/:userId/balance`
