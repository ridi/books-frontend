# Mergify test

```spacebars

            .--.                   .---.
        .---|__|           .-.     |~~~|
     .--|===|--|_          |_|     |~~~|--.
     |  |===|  |'\     .---!~|  .--|   |--|
     |%%|   |  |.'\    |===| |--|%%|   |  |
     |%%|   |  |\.'\   |   | |__|  |   |  |
     |  |   |  | \  \  |===| |==|  |   |  |
     |  |   |__|  \.'\ |   |_|__|  |~~~|__|
     |  |===|--|   \.'\|===|~|--|%%|~~~|--|
     ^--^---'--^    `-'`---^-^--^--^---'--' hjw

       (https://www.asciiart.eu/books/books)
```

[![codecov](https://codecov.io/gh/ridi/books-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/ridi/books-frontend)
[![CircleCI](https://circleci.com/gh/ridi/books-frontend/tree/master.svg?style=svg)](https://circleci.com/gh/ridi/books-frontend/tree/master)

## Infrastructure

```
             +------------+
             | CloudFlare |
             +----+-------+                               Function Package from S3
                  |                                                   |
     +---------+--+->+------------+--->+-------------+--->+--------+  | +--------+
     |         |  |  | CloudFront |    | API Gateway |    | Lambda |<---+        |
     |         +<-+--+------------+<---+-------------+<---+--------+    |        |
     |   Web   |  |    Caching              First Rendered HTML         |   S3   |
     | Browser |  |                                                     | Bucket |
     |         +--+->+------------+------------------------------------>+        |
     |         |  |  | CloudFront |                                     |        |
     +-----+---+<-+--+------------+<------------------------------------+----+---+
           |      |    Caching              Static Files                     ^
           |      +                                                          | D
           |                     +--------+                                  | E
           +-------------------->+ Sentry +<---------------------------------+ P
                 (Un)Known Bug   +----+---+         SourceMap                | L  (with Serverless.js)
                                      |                                      | O
                                      v                                      | Y
                                  +---+---+         +-----------+            | !
                                  | Slack +-------->+ Developer +------------>
                                  | Asana |  WORK   +-----------+   WORK
                                  |  ETC  |
                                  +-------+

```

## Development

### Requirements

- Docker
- Install packages

```bash
$ yarn install --frozen-lockfile
```

**Serve with TLS**

> First run [traefik](https://github.com/ridi/traefik/blob/master/README.md),

```bash
$ docker-compose up -d
...
$ open https://books.local.ridi.io

```

**Enjoying development!**

### Testing

#### Sourcecode

```bash
$ yarn test
```

#### E2E (cypress.io)

**Set Environment Variable**

```bash
$ export CYPRESS_BASE_URL=[baseURL]
```

**Run by Docker**

```bash
$ docker-compose -f ./docker-compose.cypress.yml up --force-recreate --build
```

### Branches

#### [master](https://gitlab.com/ridicorp/frontend/books/tree/master)

#### [staging](https://gitlab.com/ridicorp/frontend/books/tree/staging)

#### [development](https://gitlab.com/ridicorp/frontend/books/tree/development)

- Deploy to https://books.ridi.io

#### Feature branches

- You should be able to guess the issue by branch name.

> ex)
> feat/add-background-color
> hotfix/fix-login-bug
> refactor/refactoring-layout-component

### FAQ

#### How to make cypress test cases

> https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell

---

## Environment variables

#### build time
```
ASSET_PREFIX
  * next plugins
STAGE
  * dotenv
  * CSP
NODE_ENV
  * next custom server
  * SentryCliPlugin
  * DefinePlugin
NEXT_PUBLIC_*
  * source codes
```

#### runtime
```
ASSET_PREFIX
  * next/document
NODE_ENV
  * next custom server
SERVERLESS
  * next custom server
```
