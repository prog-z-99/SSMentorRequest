## Summoner School Mentor Request web application

Built with [Next.js](https://nextjs.org/docs), [Next-Auth](https://next-auth.js.org/getting-started/introduction), and [MongodDB](https://www.mongodb.com/docs/)

## Prerequisites:

Works on `yarn v3.5.1` and node `v16.20.1`

## Setup

```bash
yarn
```

## Configuration

### Set up a MongoDB database

Set up a MongoDB database either locally or with [MongoDB Atlas for free](https://mongodb.com/atlas).

### Set up environment variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.local.example .env.local
```

Set each variable on `.env.local`:

- `MONGODB_URI` - Your MongoDB connection string.
- `DISCORD_CLIENT_ID` && `DISCORD_CLIENT_SECRET` - Needed for Next Auth API access, check `Next-Auth` for more details on how to setup.
- `DISCORD_BOT_TOKEN` - Required for sending messages to users.

### Run Next.js in development mode

```bash

yarn
yarn dev

```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)!

You will either see a message stating "You are connected to MongoDB" or "You are NOT connected to MongoDB". Ensure that you have provided the correct `MONGODB_URI` environment variable.
