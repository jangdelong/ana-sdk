import path from 'path'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import {eslint} from 'rollup-plugin-eslint'
import {terser} from 'rollup-plugin-terser'
import {DEFAULT_EXTENSIONS} from '@babel/core'

import pkg from './package.json'

const paths = {
  input: path.join(__dirname, '/src/index.ts'),
  output: path.join(__dirname, '/lib'),
}

const isDev = process.env.NODE_ENV !== 'production'

// rollup 配置项
const rollupConfig = [
  // browser-friendly UMD build
  {
    input: paths.input,
    output: {
      name: pkg.name,
      file: path.join(paths.output, 'index.umd.js'),
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      eslint(),
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      rollupTypescript(),
      babel({
        runtimeHelpers: true,
        // 只转换源代码，不运行外部依赖
        exclude: 'node_modules/**',
        // babel 默认不支持 ts 需要手动添加
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts',
        ],
      }),
      !isDev && terser(),
    ],
  },
  {
    input: paths.input,
    output: [
      // 输出 commonjs 规范的代码
      {
        file: path.join(paths.output, 'index.js'),
        format: 'cjs',
        name: pkg.name,
      },
      // 输出 es 规范的代码
      {
        file: path.join(paths.output, 'index.esm.js'),
        format: 'es',
        name: pkg.name,
      },
    ],
    // external: ['lodash'], // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
    // plugins 需要注意引用顺序
    plugins:[
      // 验证导入的文件
      eslint({
        throwOnError: true, // lint 结果有错误将会抛出异常
        throwOnWarning: true,
        include: ['src/**/*.ts'],
        exclude: ['node_modules/**', 'lib/**', '*.js'],
      }),
      // 配合 commnjs 解析第三方模块
      resolve({
        // 将自定义选项传递给解析插件
        customResolveOptions: {
          moduleDirectory: 'node_modules',
        },
      }),
      // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
      commonjs(),
      rollupTypescript(),
      // babel({
      //   runtimeHelpers: true,
      //   // 只转换源代码，不运行外部依赖
      //   exclude: 'node_modules/**',
      //   // babel 默认不支持 ts 需要手动添加
      //   extensions: [
      //     ...DEFAULT_EXTENSIONS,
      //     '.ts',
      //   ],
      // }),
    ],
  },
]

export default rollupConfig
