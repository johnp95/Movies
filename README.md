# Movies

A personal movie log: every film I've watched, with search, director/actor
pages, Best Picture winners and foreign films.

**Live:** https://johnpennyman.com

## Tech stack

- **Frontend:** React + Vite, Tailwind, MUI
- **Backend:** Django + Django REST Framework (token auth)
- **Database:** PostgreSQL 17
- **Hosting:** DigitalOcean droplet running Docker Compose, with Caddy for HTTPS
- **CI/CD:** GitHub Actions: tests on every PR, automatic deploy on merge to `main`

## Run locally

Requires Docker Desktop.

1. Clone the repo:
    ```bash
    git clone https://github.com/johnp95/Movies.git
    cd Movies
    ```
2. Create your dev settings from the template:
    ```bash
    cp .env.example .env.dev
    ```
    For local development, set at least:
    ```
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1
    DB_HOST=db
    DB_PORT=5432
    ADMIN_URL=admin
    ```
3. Start everything:
    ```bash
    docker compose up --build
    ```
4. In a second terminal, create a login:
    ```bash
    docker compose exec backend python manage.py createsuperuser
    ```

| What  | URL                               |
| ----- | --------------------------------- |
| App   | http://localhost:5173             |
| API   | http://localhost:8000/api/movies/ |
| Admin | http://localhost:8000/admin/      |

## Tests

```bash
docker compose exec backend python manage.py test
cd frontend && npm run lint && npm run build
```

The same checks run in GitHub Actions on every pull request.

## Deployment and maintenance

- Work on `dev`, then open a PR into `main`. When the checks pass and it's
  merged, it deploys automatically. See [DEPLOY.md](DEPLOY.md) for manual
  deploys and rollbacks.
- Monthly upkeep: [MAINTENANCE.md](MAINTENANCE.md).
