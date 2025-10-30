export default [
  {
    input: './test/index.spec.ts',
    output: {
      file: './test/dist/browser/test/index.js',
      format: 'es',
      sourcemap: true
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  }
];
