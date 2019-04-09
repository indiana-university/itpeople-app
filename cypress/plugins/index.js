// Hook into the Cypress preprocessor for TypeScript support

const webpack = require('@cypress/webpack-preprocessor')

module.exports = on => {

  const webpackOptions = {
    module: {
      rules: [
        {
          exclude: [/node_modules/],
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
    },
  }

  on('file:preprocessor', webpack({ webpackOptions }))
}