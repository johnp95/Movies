# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal movie log (live at johnpennyman.com): Django REST backend + React/Vite frontend + PostgreSQL 17, run with Docker Compose.

## Commands

Local dev runs entirely in Docker (needs `.env.dev`, copied from `.env.example`; the values there work as-is):

```bash
docker compose up --build                                   # app :5173, API :8000/api/movies/, admin :8000/admin/
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py test           # all backend tests
docker compose exec backend python manage.py test MovieApp.tests.MovieAPITests.test_search   # single test
docker compose exec backend python manage.py makemigrations
```

Frontend (from `frontend/`): `npm run lint` (ESLint, `--max-warnings 0`, so any warning fails CI), `npm run build`, `npm run dev`. There are no frontend tests.

CI (`.github/workflows/ci.yml`) runs on every PR and on push to `main`: backend tests against Postgres, `makemigrations --check` (forgetting a migration fails CI), `collectstatic`, frontend lint + build, production image build, and `caddy validate`. A push to `main` that passes all of these auto-deploys to the DigitalOcean droplet over SSH.

## Workflow

Work on `dev`, open a PR into `main`; merging deploys. Manual deploy/rollback steps are in `DEPLOY.md`, monthly upkeep (dependency bumps etc.) in `MAINTENANCE.md`. Python versions in `backend/requirements.txt` are pinned and bumped deliberately.

## Architecture

**Backend** (`backend/`): `MovieProject/` is the Django project (settings, root urls), `MovieApp/` holds the single `Movie` model, migrations and the tests, and `api/` holds the DRF views/serializers/urls (all under `/api/`).

- `settings.py` reads required env vars (`SECRET_KEY`, `ALLOWED_HOSTS`, `POSTGRES_*`, `DB_HOST`, `DB_PORT`) at import time with `os.environ[...]`, so any `manage.py` command outside Docker needs them set (CI and the Dockerfile pass dummy values for this).
- Postgres-only features are used: `actors`/`actresses` are `ArrayField`s (queried with `__contains=[name]`), and the search/detail views use `.distinct("title")` (DISTINCT ON). SQLite won't work.
- **One row per viewing**: a rewatched movie appears as multiple `Movie` rows sharing title/release year but with different `date_watched`. Search and detail views dedupe with `distinct("title")`; `MovieDetail.perform_update` propagates `SHARED_FIELDS` to every other row with the same (old) title + released year, so the film's details stay in sync across viewings. Keep this in mind when adding fields to the model.
- Auth: DRF `TokenAuthentication`, default permission `IsAuthenticatedOrReadOnly` (reads are public, writes need a token). Tokens come from `POST /api/token/` (throttled 5/min). Session auth and the browsable API are enabled only when `DEBUG=True`. The admin path is `ADMIN_URL` (non-obvious in production). `/api/health/` is an unauthenticated liveness check.
- No server-side pagination: `/api/movies/` returns every movie (newest `date_watched` first).

**Frontend** (`frontend/src/`): React 19 + react-router data router (routes in `App.jsx`), MUI + Tailwind v4, react-hook-form + yup for forms.

- All API calls go through `components/Axios.jsx`, which attaches `Authorization: Token <token>` from `localStorage`. `context/AuthContext.jsx` handles login/logout; `components/RequireAuth.jsx` guards the home/add/edit/delete routes, while search and detail pages are public.
- `config.js`: in dev the API base URL is the page's own hostname on port 8000 (so phones on the LAN work); in production it's `VITE_API_BASE_URL_PROD`, set to `/` because the API is same-origin.
- Pagination is client-side via `hooks/usePagination.js`, stored in the `?page=` query param.
- Actors/actresses are arrays in the API but edited as comma-separated text (`utils/names.js`).

**Production** (`docker-compose.prod.yml`, project name `movies-prod`): the frontend image's `prod` stage is Caddy, which serves the Vite build, terminates HTTPS, and reverse-proxies `/api/*`, `/api-auth/*`, `/static/*` and the admin path to gunicorn (`frontend/Caddyfile`). A one-off `migrate` service applies migrations before `backend` starts. Django static files are served by WhiteNoise. Env comes from `.env.prod` on the server (`DEBUG` is forced to `False` in the compose file).
