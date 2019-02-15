var path = require('path');

module.exports = {
  externals: [
    {
      react: 'React',
      'react-dom': 'ReactDOM',
      // '@material-ui/core': 'window["material-ui"]'
    },
    externalMaterialUI
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, "src")
          // path.resolve(__dirname, "node_modules/ui")
        ],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

/** Callbacks with global UMD-name of material-ui imports */
function externalMaterialUI (_, module, callback) {
  var isMaterialUIComponent = /^@material-ui\/core\/([^/]+)$/;
  var match = isMaterialUIComponent.exec(module);
  if (match !== null) {
    var component = match[1];
    return callback(null, `window["material-ui"].${component}`);
  }
  callback();
}