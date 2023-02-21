# SpareFoodShareBackend
![Python Version](https://img.shields.io/badge/Python_Version-3.9_|_3.10_|_3.11-informational?style=flat&logo=python&logoColor=white&color=11BB11)
![Lint](https://github.com/404-N0tFound/SpareFoodShareBackend/actions/workflows/lint.yml/badge.svg?branch=main)

This is the backend code for Spare Food Share. Here is where all the logic and database management will happen.

# Running
Ensure that you have a local build of whatever stable version of the [front-end application](https://github.com/404-N0tFound/SpareFoodShareFrontend) is.
Once you have a build, specify the location and a secret key in your `.env` file. With that, you can launch the app using `python src/manage.py runserver`.