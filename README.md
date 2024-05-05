#  To run on Azure (Servers are down, need a job to afford costs 😊 )
- Access API [Api](https://moviesdjangoreact.azurewebsites.net/api/movies/)

- Access UI [UI](https://ashy-cliff-0dda47b10.4.azurestaticapps.net/)
# To run The Application With Docker
- With docker installed, open the IDE of your choice

- Create a directory, open a terminal, and run ```git clone https://github.com/johnp95/Movies.git```

- cd into directory where docker-compose.yml is located (top level)

- Run commands ```docker compose pull``` ```docker compose up```

- Access API http://localhost:8000/api/movies
  
- Access UI http://localhost:5173
# Instructions Without Docker
- Open the IDE of your choice and install node.js, npm, and python if necessary

- Create a directory, open a terminal, and run ```git clone https://github.com/johnp95/Movies.git```

- Enter backend directory ```cd backend```

- create virtual environment ```python -m venv *name* ```

- cd into *MovieProject* directory ```cd MovieProject```

- while in the virtual environment install dependencies ```pip install django djangorestframework Pillow psycopg2 django-cors-headers```

- Apply migrations ```python manage.py makemigrations``` ```python manage.py migrate```

- Run server ```python manage.py runserver```

- Access api at http://localhost:8000/api/movies

- Open a new terminal while the backend server is running and cd into frontend directory

- install dependencies and run server ```npm install``` ```npm run dev```

- access server http://localhost:5173

# To See Movies From My Local Database (With postgres installed. Change user/localhost if needed)
- create local database named *movies*

- ```psql -h localhost -U postgres -d movies -f latest.sql``` 
