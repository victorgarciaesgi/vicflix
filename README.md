# Vicflix

<p align="center">
<img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
<img width="100" src="https://d33wubrfki0l68.cloudfront.net/ff3666b10124b7c29e14fd20d9c7c11c1908a718/4111c/logos/nuxt.svg" alt="nuxt logo">
<img width="100" src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" alt="ts logo">
<img width="100" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/1200px-GraphQL_Logo.svg.png" alt="graphql logo">
<img width="100" src="https://seeklogo.com/images/A/apollo-logo-DC7DD3C444-seeklogo.com.png" alt="apollo logo">
<img width="100" src="https://tailwindcss.com/img/tailwind.svg" alt="tailwind logo">
</p>

# Dependencies Installation

```bash
yarn
```

# Change API url endpoint

- `env.development` -> `NUXT_ENV_API_URL` envirronement for development
- `env.production` -> `NUXT_ENV_API_URL` envirronement for production
- `env.testing` -> `NUXT_ENV_API_URL` envirronement for testing
- `env.staging` -> `NUXT_ENV_API_URL` envirronement for staging

# Developpment

```bash
yarn dev
```

Endpoint: [localhost:4100](http://localhost:4100)

# Regenerates Typescript schemas

```bash
yarn generate [stage] (default:development)
```

# Production builds and deployments

## Configure build for Stages

- Edit `.env.{stage}`

All production builds will build front-end with NODE_ENV set to `production` and start a nuxt/node server on post `5100`

### Production build

complete `.env.production` with according API URLs

```bash
yarn deploy production
```
