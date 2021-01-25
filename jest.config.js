/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '.',
  preset: 'ts-jest',
  testRegex: 'src/.*\\.spec\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      isolatedModules: true,
    },
  },
  testURL: 'http://localhost/',
}
