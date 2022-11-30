<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://i.imgur.com/4xiI9Hu.png" width="620" alt="Nest Logo" /></a>
</p>

> ### Blog made using Nestjs + Mikro-orm codebase(backend) containing real world examples (CRUD, auth (password based and oauth), advanced patterns, etc)

<p align="center">
<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/rubiin/ultimate-nest">
<img alt="Workflow test" src="https://github.com/rubiin/ultimate-nest/actions/workflows/github-ci.yml/badge.svg">
<img alt="GitHub" src="https://img.shields.io/github/license/rubiin/ultimate-nest">
<img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/rubiin/ultimate-nest">
</p>
<p align="center">
<a href="https://www.buymeacoffee.com/XbgWxt567" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
</p>
<br/>
NOTE: Starting April 18,2022 , the repo has ditched most promises for observables. You can check the latest promised version code at
[commit](https://github.com/rubiin/ultimate-nest/tree/fb06b34f7d36f36195880e600f8f1b5b86f71213)

<br/>


## Prerequisites

NodeJS
https://nodejs.org/en/

Typescript
https://www.typescriptlang.org/

PostgresQL
https://www.postgresql.org/

Redis
https://redis.io/

RabbitMQ
https://www.rabbitmq.com



# Getting started

Clone this repo. Edit the env file and pass in your credentials

## Installation

Install dependencies (preferred: pnpm)

```sh
 npm install --legacy-peer-deps
 yarn install
 pnpm install --shamefully-hoist=true
```

## Database

<p align="center">
  <a href="https://mikro-orm.io/" target="blank"><img src="https://raw.githubusercontent.com/mikro-orm/mikro-orm/master/docs/static/img/logo-readme.svg?sanitize=true" width="320" alt="Mikro Orm" /></a>
</p>

The example codebase uses [MikroORM](https://mikro-orm.io/) with a Postgres database.

Copy sample env file and adjust the connection settings and other settings(jwt,redis,mail,etc) respectively on sample env file

`Note`: Env files are kept in env folder. The config validation allows 4 environment ['dev', 'prod', 'test','stage']. The env file name
should be of format .env.[environment] Ex. (.env.dev). The env to use should be provided while running any script as NODE_ENV=dev npm run dev

Start local Postgres server and run `NODE_ENV=dev make migrate` to apply migrations

Now you can start the application witt `NODE_ENV=dev npm run start`.

Note: If you are using windows, `SET NODE_ENV=dev npm run start`

---

## Features covered:

-   🌐 **I18n** - Internationalization
-   🧵 **Stats** - swagger stats for common server metrics
-   🧵 **Poolifier** - threads for cpu extensive tasks
-   💬 **Twillio** - sms support
-   📱 **NestJS** — latest version
-   🎉 **TypeScript** - Type checking
-   ⚙️ **Dotenv** - Supports environment variables
-   🗝 **Authentication** - JWT, RSA256, oauth
-   🏬 **Authorization** - RBAC with casl
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

-   `npm run start` - Start application
-   `npm run start:dev` - Start application in watch mode
-   `npm run test` - run Jest test runner
-   `npm run start:prod` - Build application

Additionally, you can also see the scripts in `makefile`

---

## Setup

-   First if you don't want to use any libs from like redis, mailer etc. replace them from the app.module.tasks
    -   You will also need to remove the config from `validate.config.ts` from line ` load: []`
    -   Also remove the unwanted config variables from the env file
-   Make sure you create a env file under `env` directory with name like `.env.something`.The portion after .env is the `NODE_ENV` value which will be required while running the app
-   Also make sure you have ssl files inside `src/resources/ssl` if you tend to use ssl. Replace the sample files with your ssl files but keep the name same. Additionally

## Migration and seeding

Migrations are used to update the database schema. The migration files are stored in `migrations` directory.

```sh
  env=dev make migrate # applies migration for dev env
```

Seeding is used to insert data into the database. The seeding files are stored in `common/database/seeders` directory.

```sh
  env=dev make seed   # seeds data for dev env with user password set as Test@1234
```

## Start application

-   `NODE_ENV=[env name] npm run start` (without ssl)
-   `NODE_ENV=[env name] SSL=true npm run start` (with ssl)
-   Test api by browsing to `http://localhost:[port]/v1/user`
-   View automatically generated swagger api docs by browsing to `http://localhost:[port]/docs`
-   View automatically generated swagger stats dashboard by browsing to `http://localhost:[port]/stats`. The username and password is the values set in the env file under `SWAGGER_USERNAME` and `SWAGGER_PASS` respectively

## File structure

```text
ultimate-nest
├── env                                           * Contains all configuration files
│   └── .env.example                              * Sample configuration file.
│   └── .env.dev                                  * Configuration file for development environment.
│   └── .env.prod                                 * Configuration file for production environment.
│   └── .env.test                                 * Configuration file for test environment.
├── coverage                                      * Coverage reports after running `yarn test:cov` command.
├── dist                                          * Optimized code for production after `yarn build` is run.
├── src
    └── modules                                   * Folder where specific modules all files are stored
          └── <module>
      │       └── dto                             * Data Transfer Objects.
      │       └── <module>.controller.ts          * Controller file.
      │       └── <module>.module.ts              * root module file for module.
      │       └── <module>.service.ts             * Service file for <module>.
      │       └── <module>.service.spec.ts        * Test file for service.
      │       └── <module>.repository.ts          * Repository file for <module>.
      │       └── <module>.repository.spec.ts     * Test file for repository.
│   └── common                                    * Common helpers function, dto, entity,guards, custom validators,types, exception, decorators etc.
│   └── __mocks__                                 * Fixtures for unit tests.
│   └── libs                                      * Resusable pre configured libraries
│   └── resources                                 * Contains all static resources like ssl, i18n,email templates etc.
│   └── app.module.ts                             * Root module of the application.
│   └── main.ts                                   * The entry file of the application which uses the core function NestFactory to create a Nest application instance.
├── test                                          * End to end test files for the application.

```

# Authentication

This applications uses JSON Web Token (JWT) to handle authentication. The token is passed with each request using the `Authorization` header with `Token` scheme. The JWT authentication middleware handles the validation and authentication of the token.

# Deployment

You need to have `docker` and `docker-compose` (not the compose plugin) installed. Also since we are using `makefiles` for deployment, you need to have `make` installed.

```sh
  env=dev make deploy    # deploys dev environment (.env.dev used)
  env=prod make deploy   # deploys prod environment (.env.prod used)
```

The password for `redis` and `rabbitmq` is `Test@1234` can be changed in the make file under `deploy` script

## sample env

The sample env is generated using [sample-env](https://www.github.com/rubiin/sample-env)

More docs found at `docs` folder
