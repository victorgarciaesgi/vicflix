# Vicflix

<p align="center">
<img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
<img width="100" src="https://d33wubrfki0l68.cloudfront.net/ff3666b10124b7c29e14fd20d9c7c11c1908a718/4111c/logos/nuxt.svg" alt="nuxt logo">
<img width="100" src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" alt="ts logo">
<img width="100" src="https://tailwindcss.com/img/tailwind.svg" alt="tailwind logo">
</p>

# Dependencies Installation

```bash
yarn
```

# Change API url endpoint

- `env.development` -> `NUXT_ENV_API_URL` constant for development
- `env.production` -> `NUXT_ENV_API_URL` constant for production

# Developpment

```bash
yarn dev
```

Endpoint: [localhost:5130](http://localhost:5130)

# Stages and deployments

## Configure build for Stages

- Edit `.env.{stage}` API urls
- Edit `ecosystem.config.js` stage app port

### Production build

```bash
yarn deploy production
```
