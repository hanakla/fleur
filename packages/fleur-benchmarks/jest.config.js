const { join } = require('path')

module.exports = {
  ...require('../../jest.config'),
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['<rootDir>/src/setup.ts'],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      typeCheck: false,
    },
  },
}
