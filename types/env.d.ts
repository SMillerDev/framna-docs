namespace NodeJS {
  interface ProcessEnv {
    SHAPE_DOCS_PROJECT_CONFIGURATION_FILENAME: string
    NEXT_PUBLIC_SHAPE_DOCS_TITLE: string
    SHAPE_DOCS_BASE_URL: string
    AUTH_SECRET: string
    NEXTAUTH_URL: string
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    GITHUB_APP_ID: string
    GITHUB_PRIVATE_KEY_BASE_64: string
    GITHUB_WEBHOOK_SECRET: string
    GITHUB_WEBHOK_REPOSITORY_ALLOWLIST?: string
    GITHUB_WEBHOK_REPOSITORY_DISALLOWLIST?: string
    GITHUB_ORGANIZATION_NAME: string
    REDIS_URL: string
    POSTGRESQL_HOST: string
    POSTGRESQL_USER: string
    POSTGRESQL_PASSWORD: string
    POSTGRESQL_DB: string
    SMTP_HOST: string
    SMTP_USER: string
    SMTP_PASS: string
    FROM_EMAIL: string | undefined
  }
}
