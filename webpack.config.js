var webpack = require('webpack');
var path = require('path');

var PROD = JSON.parse(process.env.NODE_ENV || '0');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/app.jsx',
  /*resolve: {
      alias: {
          'react': 'react-lite',
          'react-dom': 'react-lite'
      }
  },*/
  output: {
    path: BUILD_DIR,
    filename: 'js/bundle.js'
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production") 
      }
    }),
    ] , 

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      },
	 { test: /\.svg$/, loader: 'babel!svg-react' }
    ],
      resolve: {
        alias: {
            'react-dom': __dirname + '/node_modules/react'
        }
    },
  }
};

module.exports = config;
