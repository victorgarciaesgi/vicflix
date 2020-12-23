#!/bin/bash
if [ -z "$1" ]
  then
    yarn cross-env NUXT_ENV_STAGE=development nuxt-ts generate -c ./nuxt.config.ts
  else
    yarn run cross-env NUXT_ENV_STAGE=$1 nuxt-ts generate -c ./nuxt.config.ts
fi