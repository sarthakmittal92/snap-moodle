#!/bin/bash

rm -r api/__pycache__
rm -r api/assignments/__pycache__
rm -r api/courses/__pycache__
rm -r api/migrations
rm -r home/__pycache__
rm -r users/__pycache__
rm -r users/migrations
rm db.sqlite3
python3 manage.py makemigrations
python3 manage.py makemigrations api
python3 manage.py makemigrations users
python3 manage.py migrate --run-syncdb