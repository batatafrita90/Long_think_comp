# syntax=docker/dockerfile:1
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=development

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
# RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "dev"]
