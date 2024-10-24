const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  //   entry: "./src/main.js", // Path to your React entry point
  entry: {
    main: "./src/main.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Webpack will output this bundle
  },
  devtool: "source-map", // Use a safer source map method
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets", to: "assets" }, // as-is
        { from: "popup", to: "popup" }, // as-is
        { from: "manifest.json", to: "manifest.json" }, // as-is
        { from: "background.js", to: "background.js" }, // as-is
        { from: "src/main.html", to: "main.html" }, // as-is
        { from: "src/main.css", to: "main.css" }, // as-is
        // Add more patterns as needed
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
