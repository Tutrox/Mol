import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import {terser} from 'rollup-plugin-terser';

export default {
  input: "app/js/mol.js",
  output: {
    file: "www/assets/mol.js",
    format: "es"
  },
  plugins: [
    nodeResolve(),
    eslint({
      throwOnError: true,
      throwOnWarning: true
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled"
    }),
    terser()
  ]
};
