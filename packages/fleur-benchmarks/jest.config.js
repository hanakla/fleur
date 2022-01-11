module.exports = {
  ...require('../../jest.config'),
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['<rootDir>/src/setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      isolatedModules: true,
    },
  },
}
