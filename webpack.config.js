// webpack.config.js
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main.js", // Ensure this file exists
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets", to: "assets" },
        { from: "popup", to: "popup" },
        { from: "manifest.json", to: "manifest.json" },
        { from: "background.js", to: "background.js" },
        { from: "content.js", to: "content.js" },
        { from: "src/main.html", to: "main.html" },
        { from: "src/main.css", to: "main.css" },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
