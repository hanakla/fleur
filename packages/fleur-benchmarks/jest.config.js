module.exports = {
  ...require('../../jest.config'),
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['<rootDir>/src/setup.ts'],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      typeCheck: false,
    },
  },
}
