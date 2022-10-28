# Fastify typescript template

## Run docker image:

Provides ready to go docker compose config

```bash
$ sudo docker compose build
$ sudo docker compose up
```

## Local installation:

```bash
$ yarn instal
```

## Local start:

```bash
$ yarn build
$ yarn start
```

## Test:

```bash
$ yarn test
$ yarn test:cov
```

## Access at:

`http://localhost:8080/api/<method>` or `http://127.0.0.1:8080/api/<method>`

## Api routes:

- POST `/sandwiches`
- GET `/sandwiches/:id`

## Description

This is ready to use fastify template using typescript, typebox validation and auto registrable routes
