const path = require("path");

module.exports = {
    mode: "production", // or "production"
  // Specify the entry point(s) for webpack to start building the bundle.
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: "tracker.js",
    path: path.resolve(__dirname, "dist"),
  },


  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
};
