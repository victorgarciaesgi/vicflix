#!/bin/bash

yarn run test:tsc || { echo '\nTypescript build failed' ; exit 1 ; }
# wait $!
# yarn run test:diagnostics || { echo '\nVTI failed, checks your props and Vue data' ; exit 1 ; }
# wait $!
# yarn run test:jest || { echo '\nJest tests failed' ; exit 1 ; }
