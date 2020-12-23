const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  testURL: 'http://localhost/',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src/' }),
    '^lodash-es$': 'lodash',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  transformIgnorePatterns: ['/node_modules/(?!lodash-es)'],
  globals: {
    'vue-jest': {
      babelConfig: {
        plugins: ['@babel/plugin-transform-runtime'],
        presets: [['@babel/preset-env', { modules: false }]],
        env: {
          test: {
            presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
          },
        },
      },
    },
  },
};
