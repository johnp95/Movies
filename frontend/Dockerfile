# --- Base: install dependencies (cached unless package*.json changes) ---
FROM node:25-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Development: Vite dev server with hot reload ---
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# --- Build: compile static assets into /app/dist ---
FROM base AS build
# Vite inlines VITE_* vars at build time, and .env is excluded by .dockerignore,
# so the API URL must be passed as a build arg.
ARG VITE_API_BASE_URL_PROD
ENV VITE_API_BASE_URL_PROD=${VITE_API_BASE_URL_PROD}
COPY . .
RUN npm run build

# --- Production: serve the static build with Caddy ---
FROM caddy:2.10-alpine AS prod
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 80
