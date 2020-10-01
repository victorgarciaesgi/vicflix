const PROJECT = 'vicflix';
const isSpa = false;
const ENVS = ['production'];

module.exports = {
  apps: [
    ...ENVS.map((env) => ({
      name: `${PROJECT}-${env}`,
      exec_mode: 'cluster',
      instances: '2',
      ignore_watch: ['.git', 'dist', '.nuxt', 'scripts'],
      ...(isSpa && { script: './scripts/production.server.js' }),
      ...(!isSpa && {
        script: './node_modules/nuxt/bin/nuxt.js',
        args: `start --spa --port=${process.env.NUXT_ENV_PORT}`,
      }),
      env: {
        NUXT_ENV_STAGE: process.env.NUXT_ENV_STAGE,
        NODE_ENV: 'production',
      },
    })),
  ],
};
