const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  mode: "development",
  entry: "./src/App.jsx",
  // entry: {
  //   index: "./src/App.js",
  //   another: "./src/components/MakePoll.jsx",
  // },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    // filename: "name.bundle.js",
    publicPath: "/",
  },
  devtool: "source-map",
  plugins: [
    new webpack.EnvironmentPlugin({
      API_URL: "http://localhost:8080",
    }),
  ],
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
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    historyApiFallback: true,
    port: 3000,
    allowedHosts: "all", // replit code
  },
  // performance: { hints: false },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
