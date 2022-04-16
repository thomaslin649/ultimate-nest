<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

> ### Blog made using Nestjs + Mikro-orm codebase(backend) containing real world examples (CRUD, auth, advanced patterns, etc)

[![CI](https://github.com/rubiin/ultimate-nest/actions/workflows/github-ci.yml/badge.svg)](https://github.com/rubiin/ultimate-nest/actions/workflows/github-ci.yml)

# Getting started

Clone this repo. Edit the env file and pass in your credentials

## Installation

Install dependencies

```sh
 yarn
```

## Database

<p align="center">
  <a href="https://mikro-orm.io/" target="blank"><img src="https://raw.githubusercontent.com/mikro-orm/mikro-orm/master/docs/static/img/logo-readme.svg?sanitize=true" width="320" alt="Mikro Orm" /></a>
</p>

The example codebase uses [MikroORM](https://mikro-orm.io/) with a Postgres database.

Copy MikroORM config example file and adjust the connection settings and other settings(jwt,redism,mail,etc) respectively on sample env file

Start local Postgres server and run `NODE_ENV=dev yarn orm:up` to apply migrations

Now you can start the application witt `NODE_ENV=dev yarn start.

Note: Env files are kept in env folder. The config validation allows 4 environment ['dev', 'prod', 'test','stage']. The env file name
should be of format .env.[environment] Ex. (.env.test). The env to use should be provided while running any script as NODE_ENV=dev npm run dev

---

## Features covered:

-   🌐 **i18n** - Internationalization
-   🧵 **piscina** - threads for cpu extensive tasks
-   💬 **Twillio** - sms support
-   📱 **NestJS** — latest version
-   🎉 **TypeScript** - Type checking
-   ⚙️ **Dotenv** - Supports environment variables
-   🗝 **Authentication** - JWT, RSA256
-   🏬 **Authorization** - RBAC
-   🏪 **MikroORM** - Database ORM
-   🏪 **PostgreSQL** - Open-Source Relational Database
-   🧠 **Configuration** - Single config for all
-   📃 **Swagger** - API Documentation
-   🐳 **Docker Compose** - Container Orchestration
-   🔐 **Helmet** - secure HTTP headers
-   😴 **Insomnia** - Insomnia config for endpoints
-   📏 **ESLint** — Pluggable JavaScript linter
-   💖 **Prettier** - Opinionated Code Formatter

## NPM scripts

-   `yarn start` - Start application
-   `yarn start:watch` - Start application in watch mode
-   `yarn test` - run Jest test runner
-   `yarn start:prod` - Build application

Additionally, you can also see the scripts in `makefile`

---

## Setup

-   First if you dont want to use any libs from like redis, mailer etc. replace them from the app.module.tasks
    -   You will also need to remove the config from `validate.config.ts` from line ` load: []`
    -   Also remove the unwanted config variables from the env file
-   Make sure you create a env file under `env` directory with name like `.env.something`.The portion after .env is the `NODE_ENV` value which will be required while running the app
-   Also make sure you have ssl files inside `src/resources/ssl` if you tend to use ssl. Replace the sample files with your ssl files but keep the name same. Additionally

## Start application

-   `NODE_ENV=[env name] yarn start` (without ssl)
-   `NODE_ENV=[env name] SSL=true yarn start` (with ssl)
-   Test api by browsing to `http://localhost:[port]/v1/user`
-   View automatically generated swagger api docs by browsing to `http://localhost:[port]/docs`

---

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token.
