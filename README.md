# Spare Food Share - Patrick's Branch (doubleCheckPls)
![Node Version](https://img.shields.io/badge/Node.js-18.14.1LTS_|_19.6.1-informational?style=flat&logo=node.js&logoColor=white&color=11BB11)
![React Version](https://img.shields.io/badge/React-^18.2.0-informational?style=flat&logo=react&logoColor=white&color=107bb1)
![Python Version](https://img.shields.io/badge/Python_Version-3.9_|_3.10_|_3.11-informational?style=flat&logo=python&logoColor=white&color=11BB11)
![Lint](https://git.shefcompsci.org.uk/com6103-2022-23/team09/project/badges/master/pipeline.svg)

This is the code for spare food share. In order to run the project, you will need the necessary node packages as well as a configured python environment from [requirements.txt](requirements.txt).

# Installation
To get all the packages installed on your local machine, you can download the support versions of node and python. From there, you can use pip to install from [requirements_dev.txt](requirements_dev.txt) and node packages from [package.json](package.json).

# Running
To compile and run the project, you will need to instantiate a react instance. You can do this by doing a node build with `npm run build`. Once you have a build, specify the location and a secret key in your `.env` file. With that, you can launch the app using `python src/manage.py runserver`. [Django](https://www.djangoproject.com/) will pick a port for you and allocate that on your localhost for you to connect to in a web browser.

# Commits

### Version 0.1.0 Date: 25/02/2023 04:38 am:
    - Descriptions:
        - Basic Functions: Read/Write data from/into database  
        - Display data from database
#### Update to Version 0.1.0
    - Modifications to models.py
    - Solve some errors in project files
    - Using .env file to replace password in file
    - Solve the errors in App.js
    - Modified README.md
#### Update by @Joshua
    - Project structure rebuild

### Version 0.1.2 Date: 28/02/2023 20:33 pm:
    - Solving the data fetch problem, now we use serializer and view to pass data to url as json
    - adjust the project structure

#### Update to Version 0.1.2
    - Add user serializers and post the user info to '/user'
    - Merged some changes, which includes a few additional js file
    - Modified view.py file to post data to frontend

#### Version 0.1.3 Date: 01/03/2023 12:25 pm
    - Add router which enables pages to redirect by @Joshua
    - some modifications to the welcome page (css) by @Joshua
    - pages now are able fetch data from the designated url

#### Update to Version 0.1.3
    - Have fetched data displayed in a table
    - Add some css files to the js files
    - Created global components, like navbar
    - test