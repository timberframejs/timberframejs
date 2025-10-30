export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/browser/js/index.js',
      format: 'es',
      sourcemap: false
    }
  },
  {
    input: './example/nav/app.ts',
    output: {
      file: './example/nav/dist/app.js',
      format: 'es',
      sourcemap: false
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  },
  {
    input: './example/basic/app.ts',
    output: {
      file: './example/basic/dist/app.js',
      format: 'es',
      sourcemap: false
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  },
   {
    input: './example/dialog/app.ts',
    output: {
      file: './example/dialog/dist/app.js',
      format: 'es',
      sourcemap: false
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  },
  {
    input: './example/dialog/app2.ts',
    output: {
      file: './example/dialog/dist/app2.js',
      format: 'es',
      sourcemap: false
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  }, 
   {
    input: './example/app.ts',
    output: {
      file: './example/dist/js/app.js',
      format: 'es',
      sourcemap: false
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  },
  {
    input: './example/customFetcher/app.ts',
    output: {
      file: './example/customFetcher/dist/js/app.js',
      format: 'es',
      sourcemap: false
    },
    resolve: {
      alias: {
        'src': './src'
      }
    }
  },
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
