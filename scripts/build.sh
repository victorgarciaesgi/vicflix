#!/bin/bash
if [ -z "$1" ]
  then
    yarn run generate
    wait $!
    yarn cross-env NUXT_ENV_STAGE=development nuxt-ts build -c ./nuxt.config.ts
  else
    yarn run generate $1
    wait $!
    yarn run cross-env NUXT_ENV_STAGE=$1 nuxt-ts build -c ./nuxt.config.ts
    
fi