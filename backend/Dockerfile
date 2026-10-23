FROM python:3.15-slim-trixie

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /code

# psycopg (pure-Python build) needs the libpq client library at runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Unprivileged user the app runs as
RUN groupadd --system app \
    && useradd --system --gid app --create-home --shell /usr/sbin/nologin app

# Pinned for reproducible builds; bump deliberately
COPY --from=ghcr.io/astral-sh/uv:0.13.1 /uv /uvx /bin/

COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

COPY . .

# settings.py reads these at import time; dummy values are only used for collectstatic
RUN SECRET_KEY=build-only \
    ALLOWED_HOSTS=localhost \
    POSTGRES_DB=x POSTGRES_USER=x POSTGRES_PASSWORD=x DB_HOST=x DB_PORT=5432 \
    python manage.py collectstatic --noinput

# Code stays root-owned (read-only for the app user)
USER app

EXPOSE 8000

CMD ["gunicorn", "MovieProject.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--access-logfile", "-"]
