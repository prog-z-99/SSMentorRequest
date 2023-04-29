## Summoner School Mentor Request web application

Built with [Next.js](https://nextjs.org/docs), [Next-Auth](https://next-auth.js.org/getting-started/introduction), and [MongodDB](https://www.mongodb.com/docs/)

## Prerequisites:

You will need `yarn` or `npm` for this. Don't get `yarn v2` for now though it's not set up for it.

## How to use

```bash
yarn
```

That's about it

## Configuration

### Set up a MongoDB database

Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string. If you are using [MongoDB Atlas](https://mongodb.com/atlas) you can find this by clicking the "Connect" button for your cluster.
- `MONGODB_DB` - The name of the MongoDB database you want to use.
- `DISCORD_CLIENT_ID` && `DISCORD_CLIENT_SECRET` - Needed for Next Auth API access, check `Next-Auth` for more details on how to setup

### Run Next.js in development mode

```bash

yarn
yarn dev

or

npm install
npm dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)!

You will either see a message stating "You are connected to MongoDB" or "You are NOT connected to MongoDB". Ensure that you have provided the correct `MONGODB_URI` and `MONGODB_DB` environment variables.

When you are successfully connected, you can refer to the [MongoDB Node.js Driver docs](https://mongodb.github.io/node-mongodb-native/3.4/tutorials/collections/) for further instructions on how to query your database.
