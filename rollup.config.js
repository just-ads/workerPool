import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default {
  input: 'src/index.js',
  output: [{
    name: 'workerPool',
    file: 'dist/workerPool.umd.js',
    format: 'umd',
    sourcemap: true
  }, {
    file: 'dist/workerPool.es.js',
    format: 'esm',
    sourcemap: false
  }],
  plugins: [
    resolve(),
    commonjs(),
    babel()
  ],
  external: []
}
