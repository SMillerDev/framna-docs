<p align="center">
  <img height="300" src="/logo.png">
</p>

# shape-docs

Portal displaying our projects that are documented with OpenAPI.

[![Build](https://github.com/shapehq/shape-docs/actions/workflows/build.yml/badge.svg)](https://github.com/shapehq/shape-docs/actions/workflows/build.yml)
[![Test](https://github.com/shapehq/shape-docs/actions/workflows/test.yml/badge.svg)](https://github.com/shapehq/shape-docs/actions/workflows/test.yml)

## Running the App Locally

Create a file named `.env.local` in the root of the project with the following contents. Make sure to replace any placeholders and generate a random secret using OpenSSL.

```
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://dev.local:3000'
AUTH0_ISSUER_BASE_URL='https://shape-docs-dev.eu.auth0.com'
AUTH0_CLIENT_ID='Your client ID'
AUTH0_CLIENT_SECRET='Your client secret'
AUTH0_MANAGEMENT_DOMAIN='shape-docs-dev.eu.auth0.com'
AUTH0_MANAGEMENT_CLIENT_ID='Your client ID'
AUTH0_MANAGEMENT_CLIENT_SECRET='Your client secret'
GITHUB_CLIENT_ID='GitHub App client ID'
GITHUB_CLIENT_SECRET='GitHub App client secret'
GITHUB_APP_ID='the GitHub App id'
GITHUB_PRIVATE_KEY_BASE_64='base 64 encoded version of the private key'
GITHUB_WEBHOOK_SECRET='preshared secret also put in app conf in GitHub'
```

Note that you need the following two Auth0 apps.

| |Type|Description|
|-|-|-|
|Default|Generic|Used to authenticate the user when they log in.|
|Management|Machine to Machine|Used for making requests to [Auth0's Management API](https://auth0.com/docs/api/management/v2) to retrieve the access token for the identity provider that the user authorized with.|

Modify your `/etc/hosts` file to add the following entry:

```
127.0.0.1 dev.local
```

We visit our local website by opening https://dev.local:3000 instead of https://localhost:3000 as this ensures that Auth0's flow will work correctly. Auth0 does some extra checks when localhost is included in the URL and we are generally not interested in those as they give a false impression of the flow the user will see.

Run the app using the following command:

```
npm run dev
```

Finally, open the application on https://dev.local:3000.
