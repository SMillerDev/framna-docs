<p align="center">
  <img height="300" src="/logo.png">
</p>

# shape-docs

Portal displaying our projects that are documented with OpenAPI. Hosted on [docs.shapetools.io](https://docs.shapetools.io) and [staging.docs.shapetools.io](https://staging.docs.shapetools.io).

[![Build](https://github.com/shapehq/shape-docs/actions/workflows/build.yml/badge.svg)](https://github.com/shapehq/shape-docs/actions/workflows/build.yml)
[![Test](https://github.com/shapehq/shape-docs/actions/workflows/test.yml/badge.svg)](https://github.com/shapehq/shape-docs/actions/workflows/test.yml)
[![Lint](https://github.com/shapehq/shape-docs/actions/workflows/lint.yml/badge.svg)](https://github.com/shapehq/shape-docs/actions/workflows/lint.yml)

## 💻 Running the App Locally

Create a file named `.env.local` in the root of the project with the following contents. Make sure to replace any placeholders and generate a random secret using OpenSSL.

```
NEXT_PUBLIC_SHAPE_DOCS_TITLE='Shape Docs'
SHAPE_DOCS_BASE_URL='https://docs.shapetools.io'
NEXTAUTH_URL='https://docs.shapetools.io'
NEXTAUTH_SECRET='use [openssl rand -base64 32] to generate a 32 bytes value'
GITHUB_CLIENT_ID='GitHub App client ID'
GITHUB_CLIENT_SECRET='GitHub App client secret'
GITHUB_APP_ID='the GitHub App id'
GITHUB_PRIVATE_KEY_BASE_64='base 64 encoded version of the private key'
GITHUB_WEBHOOK_SECRET='preshared secret also put in app conf in GitHub'
GITHUB_WEBHOK_REPOSITORY_ALLOWLIST=''
GITHUB_WEBHOK_REPOSITORY_DISALLOWLIST=''
GITHUB_ORGANIZATION_NAME='shapehq'
REDIS_URL=''
```

Each environment variable is described in the table below.

|Environment Variable|Description|
|-|-|
|NEXT_PUBLIC_SHAPE_DOCS_TITLE|Title of the portal. Displayed to the user in the browser.|
|SHAPE_DOCS_BASE_URL|The URL where Shape Docs is hosted.|
|NEXTAUTH_URL|The URL where Shape Docs is hosted.|
|NEXTAUTH_SECRET|A long secret value used to encrypt the session cookie. Generate it using `openssl rand -base64 32`.|
|GITHUB_CLIENT_ID|The client ID of your GitHub app.|
|GITHUB_CLIENT_SECRET|The client secret of your GitHub app.|
|GITHUB_APP_ID|The ID of your GitHub app.|
|GITHUB_PRIVATE_KEY_BASE_64|Your GitHub app's private key encoded to base 64. Can be created using `cat my-key.pem | base64 | pbcopy`.|
|GITHUB_WEBHOOK_SECRET|Secret shared with the GitHub app to validate a webhook call.|
|GITHUB_WEBHOK_REPOSITORY_ALLOWLIST|Comma-separated list of repositories from which webhook calls should be accepted. Leave empty to accept calls from all repositories.|
|GITHUB_WEBHOK_REPOSITORY_DISALLOWLIST|Comma-separated list of repositories from which webhook calls should be ignored. The list of disallowed repositories takes precedence over the list of allowed repositories.|
|GITHUB_ORGANIZATION_NAME|Name of the organization to show repositories for.|
|REDIS_URL|The URL to the Redis store.|

Run the app using the following command:

```
npm run dev
```

Finally, open the application on https://dev.local:3000.

## Database Schemas

See `create-tables.sql`

## 🚀 Deploying the App

The app is hosted on Heroku in two different environments.

|Environment|URL|Branch|
|-|-|-|
|Staging|[staging.docs.shapetools.io](https://staging.docs.shapetools.io)|develop|
|Production|[docs.shapetools.io](https://docs.shapetools.io)|main|

Each environment is deployed by merging changes into their respective branch. Heroku is responsible for observing changes to the repository and schedule a deployment when changes are observed.

## 📖 Getting Started with Shape Docs

Details on getting started showing documentation on Shape Docs can be [found on our Conflouence](https://shapedk.atlassian.net/wiki/spaces/DEVELOPERS/pages/3795615745/Shape+Docs).
