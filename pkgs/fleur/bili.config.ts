import { Config } from 'bili'
import typescript from 'rollup-plugin-typescript2'
import { defaultBiliConfig } from '../../bili.default.config'

export default {
  input: 'src/index.ts',
  plugins: {
    typescript2: typescript(),
    terser: defaultBiliConfig.plugins.terser,
  },
  babel: defaultBiliConfig.babel,
  bundleNodeModules: ['tslib'],
  output: {
    format: ['cjs', 'esm'],
  },
} as Config
