To run application
open the IDE of your choice
create a directory, open a terminal, and run -> git clone https://github.com/johnp95/Movies.git
install Node.js, npm, and Python if necessary

backend setup
enter backend directory -> cd backend
create virtual environment -> python -m venv *name of your choice*
cd into MovieProject directory -> cd MovieProject
while in the virtual environment pip install required dependencies -> pip install django djangorestframework Pillow psycopg2 django-cors-headers
apply migrations -> python manage.py makemigrations, python manage.py migrate
run server -> python manage.py runserver
access api at -> localhost:8000/api/movies

frontend setup
open a new terminal while the backend server is running
enter frontend directory -> (if in backend directory) cd .. , cd frontend
run npm -> npm install
run server -> npm run dev
access server at -> http://localhost:5173

