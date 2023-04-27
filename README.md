# Spare Food Share
![Node Version](https://img.shields.io/badge/Node.js-18.14.1LTS_|_19.6.1-informational?style=flat&logo=node.js&logoColor=white&color=11BB11)
![React Version](https://img.shields.io/badge/React-^18.2.0-informational?style=flat&logo=react&logoColor=white&color=107bb1)
![Python Version](https://img.shields.io/badge/Python_Version-3.9_|_3.10_|_3.11-informational?style=flat&logo=python&logoColor=white&color=11BB11)
![Lint](https://git.shefcompsci.org.uk/com6103-2022-23/team09/project/badges/master/pipeline.svg)

This is the code for spare food share. In order to run the project, you will need the necessary node packages as well as a configured python environment from [requirements.txt](requirements.txt).

# Installation
For installing all the required libraries for this project, you will need to download and install:
- The current LTS version of [Node.js](https://nodejs.org/)
- A supported version of [Python](https://www.python.org/downloads/) (3.9+)
- [Postgresql](https://www.postgresql.org/)

Next, you can simply clone this repository to your local machine. From there, `npm install` will install all necessary node modules for the project. 
It is also important to `pip install -r requirements_dev.txt` to install all python libraries including django. 
Alternatively, you can choose to install each module by hand and all versioning can be found in [requirements_dev.txt](requirements_dev.txt) and [package.json](package.json).

# Running
## Local Machine Instructions
In order to run the project on your local machine, you will need to compile and run the project.
### Front End
##### Execution
To run a live copy of the front end, it can be started with `npm run start`.
NOTE: This will only run the front end code and much of the functionality will be missing.
This is more of for development purposes.
### Back End
##### Database Setup
To run the complete web application, start your postgres database. 
This will likely be done with [pgAdmin](https://www.pgadmin.org/docs/pgadmin4/6.18/getting_started.html).
Once you have a database, if necessary you can use django to migrate by running `python manage.py makemigrations` and then `python manage.py migrate`.
##### Environment Variables
From there, to run the webservice you will need a file named `.env`.
In the environment file, you will need to specify your database configuration as well as the django secret key to start the app.
Once that is done, simply run `python manage.py runserver` and the web app will be hosted at a given port by django!
