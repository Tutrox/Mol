import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
  input: "app/js/mol.js",
  output: {
    file: "www/assets/mol.js",
    format: "es"
  },
  plugins: [
    resolve(),
    commonjs(),
    eslint({throwOnError: true, throwOnWarning: true}),
    babel({exclude: "node_modules/**"}),
    uglify()
  ]
};
