const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  entry: './src/xslt-js.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'xslt-js.js',
    library: 'XJS',
    libraryTarget: 'umd'
  },
  mode: 'production',

  resolve: {
      alias: { "stream": require.resolve("stream-browserify") }
   },
       plugins: [
		    new NodePolyfillPlugin()
	  ]

};
