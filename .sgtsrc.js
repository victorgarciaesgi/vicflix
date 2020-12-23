// @ts-check
// Simple-graphql-to-typescript configuration file, see link for more information
// https://sgts.netlify.com/configuration/config.html

/**
 * @type { import("simple-graphql-to-typescript").SgtsConfig }
 */
module.exports = {
  endpoint: process.env.NUXT_ENV_API_URL,
  output: './src/models/__generated.ts',
  codegenFunctions: true,
  customScalars: {
    DateTime: 'Date',
  },
  genFragments: true,
};
