# Vicflix

<p align="center">
<img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">

</p>

# Installation

```bash
yarn
```

# Change API url endpoint

`env.development` -> API_URL constant for development
`env.production` -> API_URL constant for production
`env.preprod` -> API_URL constant for preprod
`env.staging` -> API_URL constant for staging

## Config

Webpack config in `vue.config.js`

# Developpment

```bash
yarn dev
```

A page will open on `localhost:{PORT}`

# Extensions

- For Vscode
  - Vetur
  - Prettier
  - Typescript
  - Eslint
  - Sass
- SublimeText
  - Vue-syntax-highlight
  - Prettier
  - Eslint
  - Sass
- WebStorm/PhpStorm/InteliJ
  - Vue
  - Prettier
  - Eslint

# Get Vue devtools extension

- [Lien pour Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Lien pour Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

# Nginx config for vue router

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

# Production build

```bash
yarn prod
```

# Staging build

```bash
yarn staging
```

# Preprod build

```bash
yarn preprod
```
