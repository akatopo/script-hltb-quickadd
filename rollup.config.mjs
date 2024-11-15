import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/script-hltb-quickadd.js',
  output: {
    file: 'dist/script-hltb-quickadd.js',
    format: 'cjs',
  },
  plugins: [commonjs(), resolve()],
};
