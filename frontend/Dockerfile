FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Development: Vite dev server with hot reload ---
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]


