module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'src/.*\\.spec\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
      isolatedModules: true,
    },
  },
  testURL: 'http://localhost/',
}
