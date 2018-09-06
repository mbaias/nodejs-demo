module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:jest/recommended',
  ],
  env: {
    node: true,
    'jest/globals': true,
  },
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        'extensions': [
          '.js',
          '.jsx'
        ]
      }
    ],
    'prettier/prettier': [
      'error',
      {
        'trailingComma': 'es5',
        'singleQuote': true,
        'printWidth': 100
      }
    ]
  },
  plugins: [
    'prettier',
    'import',
    'jest',
  ]
}