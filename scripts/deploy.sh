#!/bin/bash
PROJECT="vicflix"

if [ -z "$1" ]
  then
    sh $(dirname $0)/build.sh development || { echo -e '\nNuxt build failed \n' ; exit 1 ; }
    wait $!
    yarn run cross-env NUXT_ENV_STAGE=development pm2 startOrRestart ecosystem.config.js --only $PROJECT-dev
  else
    sh $(dirname $0)/build.sh $1 || { echo -e '\nNuxt build failed \n' ; exit 1 ; }
    wait $!
    pm2 flush 
    wait $!
    yarn run cross-env NUXT_ENV_STAGE=$1 pm2 startOrRestart ecosystem.config.js --only $PROJECT-$1
fi