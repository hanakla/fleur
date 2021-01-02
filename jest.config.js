module.exports = {
  rootDir: '.',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: 'src/.*\\.spec\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.test.json',
      isolatedModules: true,
    },
  },
  testURL: 'http://localhost/',
}
