const path = require("path");

module.exports = {
    mode: "development", // or "production"
  // Specify the entry point(s) for webpack to start building the bundle.
  entry: "./src/index.js",
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
