To run on Azure (Servers are down, need a job to afford costs :) )

access api at > https://moviesdjangoreact.azurewebsites.net/api/movies/

access frontend at -> https://ashy-cliff-0dda47b10.4.azurestaticapps.net/

To run the application with docker

Have docker installed

open the IDE of your choice

create a directory, open a terminal, and run ->

git clone https://github.com/johnp95/Movies.git

cd into directory where docker-compose.yml is located (top level)

run commands ->

docker compose pull

docker compose up

access api at -> http://localhost:8000/api/movies

access react app  at -> http://localhost:5173

Without docker ->

open the IDE of your choice
create a directory, open a terminal, and run ->

git clone https://github.com/johnp95/Movies.git

install Node.js, npm, and Python if necessary

backend setup

enter backend directory -> cd backend

create virtual environment -> 

python -m venv *name*

cd into MovieProject directory ->

cd MovieProject

while in the virtual environment pip install required dependencies -> 

pip install django djangorestframework Pillow psycopg2 django-cors-headers

apply migrations -> 

python manage.py makemigrations, python manage.py migrate

run server -> 

python manage.py runserver

access api at -> http://localhost:8000/api/movies

frontend setup

open a new terminal while the backend server is running

enter frontend directory -> (if in backend directory)

cd .. , cd frontend

run npm -> npm install

run react app  -> npm run dev

access server at -> http://localhost:5173

