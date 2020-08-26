FROM node:lts-alpine3.12

# Make project dir
RUN mkdir -p /opt/app
RUN mkdir -p /app /config
WORKDIR /opt/app

# Copy files
COPY . /opt/app

# Build frontend
RUN npm ci

ENTRYPOINT /bin/sh ./docker/docker-entrypoint.sh
