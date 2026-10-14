FROM python:3.14.8-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
PYTHONUNBUFFERED=1

WORKDIR /code

RUN apt-get update && apt-get install -y curl 

COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/

COPY ./requirements.txt . 

RUN uv pip install -r requirements.txt --system

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]