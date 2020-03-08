var path = require('path');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: [
    "./app/app.jsx"
  ],
  resolveLoader: {
    modules: ['node_modules'],
    moduleExtensions: ['-loader']
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  output: {
    path: path.join(__dirname, "app"),
    filename: "app.js"
  },
  //optimization: {
    //minimizer: [new UglifyJsPlugin({
    //  uglifyOptions: {
    //    mangle: {
    //      except: ["Array", "BigInteger", "Boolean", "Buffer", "ECPair", "Function", "Number", "Point", "Script"]
    //    }
    //  }
    //})],
  //},
  plugins: [],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.jsx$/, loader: "react-hot-loader" },
      { test: /\.js$/, include: /app/, loader: "babel-loader", query: { presets: ["es2015"] }},
      { test: /\.jsx$/, include: /app/, loader: "babel-loader", query: { presets: ["react", "es2015"] }},
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.woff|woff2$/, loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf$/, loader: "file-loader" },
      { test: /\.eot$/, loader: "file-loader" },
      { test: /\.jpg/, loader: "url-loader?limit=10000&mimetype=image/jpg" },
      { test: /\.gif/, loader: "url-loader?limit=10000&mimetype=image/gif" },
      { test: /\.png/, loader: "url-loader?limit=30000&mimetype=image/png" },
      { test: /\.svg/, loader: "url-loader?limit=10000&mimetype=image/svg" }
    ]
  }
};
