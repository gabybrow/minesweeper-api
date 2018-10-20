# Minesweeper

## Set Up
You will need `PostgreSQL`, `NodeJs` & `NPM` to run the API. The node version I'm using is v8.11.3

Once the dependencies are installed, clone the repository and run on the root directory.
```bash
npm install
```

For setting up the database, you'll need to set up some env variables. For that, create a `.env` file on the root directory and insert this:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=minesweeper
DB_USERNAME=postgres
DB_PASSWORD=postgres
DEFAULT_ROWS=8
DEFAULT_COLS=8
DEFAULT_MINES=10
```

Once added the env variables, just for the first time, you will need to run on the root directory the following commands.

```bash
node_modules/.bin/sequelize db:create
npm run migrations
```

Now you are ready to go!

## Start the API

In order to start the API, just run 

```bash
npm start
```

And then the app runs on `localhost:8080`

------------------------------------------------------

You can find some basic documentation in `localhost:8080/api-docs`