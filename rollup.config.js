import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import { eslint } from 'rollup-plugin-eslint'
import pkg from './package.json'

const isDev = process.env.NODE_ENV !== 'production'

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'errlock',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      eslint(),
      babel({
        runtimeHelpers: true,
        exclude: ['node_modules/**']
      }),
      !isDev && terser()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
]
