# Final project UpLeveled

This is the repository for my final project while attending the UpLeveled Bootcamp.

The main idea behind this application was to build a movie recommendation system that allows for more than one input and get the best pick that suits the input the most. The recommendation system was built from scratch, using datasets from [kaggle.com](https://www.kaggle.com), in Python. The recommendation system is accessed via a seperate [Django API](https://github.com/DerTimonius/recommendation-box-django).

The user can, after registration, pick up to six different movies and TV shows and get the recommendation system started! Have fun!

I have taken down the server for the Django API, so the application won't work online. But I added a few things to the [Installation Guide](#installation-guide) of the README so that you can use it locally without the need to connect to the Django API.

## Table of contents

1. [Technologies used](#technologies-used)
2. [Installation guide](#installation-guide)
3. [Setting up the database](#setting-up-the-database)
4. [Run the dev server](#run-the-dev-server)
5. [Deployment](#deployment)
6. [Screenshots](#screenshots)
7. [Running it locally](#running-it-locally)

## Technologies used

- React.js, Next.js
- Material UI
- Python
  - Pandas
  - Numpy
  - Sci-kit learn
  - Django API
- PostgreSQL
- Jest, Playwright
- Fly.io
- Docker

## Installation guide

If you would like to use this project locally, after cloning the project and changing to the correct directory, you need to do the following steps in your terminal:

1. Get the necessary dependencies for React.js/Next.js using either

```
yarn
```

or

```
npm install
```

2. This project uses Python for the movie recommendation system. It's currently running on Python 3.10.8, but you can install the latest version [here](https://www.python.org).
3. Next we will install the dependencies for python (Pandas, Numpy and Sci-kit learn). If you don't mind installing these globally, you can skip the next two commands, but if you don't want to install these globally, you have to create a virtual environment for Python first by typing

```
python -m venv <directory_name>
```

For example, this command could be:

```
python -m venv venv
```

This directory can also be inside the project, remember to put it inside the `.gitignore` file.
To activate the virtual environment, use the command (on Mac)

```
source <directory_name>/bin/activate
```

On Windows, use the following

```
source <directory_name>/Scripts/activate.bat
```

Now (independent if you're installing the dependecies locally or globally), for the necessary dependencies type the command

```
pip install -r requirements.txt
```

in your terminal.

## Setting up the database

This project uses PostgreSQL, so make sure it is installed locally on your machine. Then, start postgres by typing on Mac:

```
psql postgres
```

or on Windows:

```
psql -U postgres
```

or on Linux:

```
sudo psql -U postgres
```

If you didn't change the password on setup, it will be `postgres`. Now to create the necessary database, use the following command:

```
CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
```

<details>
<summary>
If you are using PostgreSQL15 you need to perform the following steps as well: </summary>
Right after the previous three commands, while still being the super user:

```bash
\c <database name> postgres
```

Now you're connected to your database as the super user. This is necessary for you to grant permission to the public schema to your newly created user:

```bash
GRANT ALL ON SCHEMA public TO <user name>;
```

</details>

Before you can do migrations, you have to create a `.env` file. Check the `.env.example` file for reference.

If everything is setup, either after closing postgres or in a separate terminal window, you can run `yarn migrate up` or `npm run migrate up` to create the necessary tables. Check postgres by using `SELECT * FROM users;` to make sure it worked.

## Run the dev server

To see the project in your own browser, type the following command:

```
yarn dev
```

or, when using npm:

```
npm run dev
```

## Deployment

This app has been dockerized and deployed on fly.io.

## Screenshots

Search functionality:
![Screenshot of search functionality](/screenshots/screenshot-1.png)

Recommended Movies:
![Screenshot of recommended movies](/screenshots/screenshot-2.png)

DrawSQL schema:
![Screenshot of DrawSQL schema](/screenshots/drawsql.png)

## Running it locally

Since I took down the Django API, you have to do some changes to the codebase to get it working on your local machine.

In two files ([pages/api/movies/search](/pages/api/movies/search.ts) and [pages/api/movies/recommend](/pages/api/movies/recommend.ts)) I provided a different method of how to connect JS to Python.
For example in the `search` file you will find this:

```ts
// if you want to use this application locally, comment out the following line of code and remove line 41
// const data = JSON.parse(await checkSearch(searchItem));

// get the data by connecting to external Django API
const data = await searchFromDjango(searchItem);
```

and something similar in the `recommend` file.
