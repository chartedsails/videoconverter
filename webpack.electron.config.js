const path = require("path")
const webpack = require("webpack")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
  },
  devtool: "source-map",
  entry: {
    main: "./src/main/index.ts",
  },
  target: "electron-main",
  // in order to ignore all modules in node_modules folder
  externals: [nodeExternals({ additionalModuleDirs: ["../node_modules"] })],
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/573#issuecomment-305408048
    new webpack.DefinePlugin({
      "process.env.FLUENTFFMPEG_COV": false,
    }),
  ],
}
