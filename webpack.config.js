var webpack = require('webpack');
var path = require('path');

var APP_PATH = 'src/client/app/';
var APP_DIR = path.resolve(__dirname, APP_PATH);
var BUNDLE_DIR = path.resolve(__dirname, 'bundle/');

var config = {
  entry: APP_DIR + '/app.jsx',
  output: {
    path: BUNDLE_DIR,
    filename: 'bundle.js'
  },

  	  /*
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production") 
      }
    }),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
    ] , 
    */

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      },
    ],
      resolve: {
        alias: {
            'react-dom': __dirname + '/node_modules/react'
        }
    },
  }
};

module.exports = config;
