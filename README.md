# Final project UpLeveled

This is the repository for my final project while attending the UpLeveled Bootcamp.

When progressing in this project, this Readme will be revised multiple times.

### Technologies used

* React.js, Next.js
* Material UI
* Python
  * Pandas
  * Numpy
  * Sci-kit learn
* PostgreSQL
* (Jest, Playwright)
* Fly.io

### Installation guide

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
3. Next we will install the dependencies for python (Pandas, Numpy and Sci-kit learn). If you don't mind installing these locally, you can skip the next two commands, but if you don't want to install these globally, you have to create a virtual environment for Python first by typing
```
python -m venv <directory_name>
```
For example, this command could be:
```
python -m venv venv
```

This directory can also be inside the project, remember to put it inside the ``.gitignore`` file.
To activate the virtual environment, use the command (on Mac)
```
source <directory_name>/bin/activate
```
On Windows, use the following
```
source <directory_name>/Scripts/activate.bat
```

Now, for the necessary dependencies, type the command
```
pip install -r requirements.txt
```
in your terminal.

### Setting up the database

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
If you didn't change the password on setup, it will be ``postgres``. Now to create the necessary database, use the following command:
```
CREATE DATABASE <database name>;
CREATE USER <user name> WITH ENCRYPTED PASSWORD '<user password>';
GRANT ALL PRIVILEGES ON DATABASE <database name> TO <user name>;
```
If everything is setup, either after closing postgres or in a separate terminal window, you can run ``yarn migrate up`` or ``npm run migrate up`` to create the necessary tables. Check postgres by using ``SELECT * FROM users;`` to make sure it worked.

### Creating the .env file

Check the .env.example file to see what environmental variables you need. You will also need a (free) API key from Open Movie Database.
