module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-trailing-spaces': [
      'error',
      { 'skipBlankLines': true }
    ],
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'only-multiline',
      'functions': 'never',
    }
    ],
  }
};
