const PROJECT = 'vicflix';
const ENVS = ['dev', 'production'];

module.exports = {
  apps: [
    ...ENVS.map((env) => ({
      name: `${PROJECT}-${env}`,
      exec_mode: 'cluster',
      error_file: `~/logs/${PROJECT}-${env}-error.log`,
      out_file: `~/logs/${PROJECT}-${env}-out.log`,
      instances: '2',
      ignore_watch: ['.git', 'dist', '.nuxt', 'scripts'],
      script: './node_modules/.bin/nuxt',
      args: `start --modern -c ./nuxt.config.ts`,
      env: {
        NUXT_ENV_STAGE: process.env.NUXT_ENV_STAGE,
        NODE_ENV: 'production',
      },
    })),
  ],
};
