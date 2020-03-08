import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import json from 'rollup-plugin-json'
import svgr from '@svgr/rollup'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  onwarn (warning, warn) {
    // skip certain warnings
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    // Use default for everything else
    warn(warning);
  },
  // added to resolve external warning
  // external: [ 'cluster', 'crypto' ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    postcss({
      plugins: []
    }),
    url(),
    svgr(),
    json(), // moved above babel
    babel({
      exclude: [
        'node_modules/**'
      ],
      plugins: [ 'external-helpers' ]
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs()
  ]
}
