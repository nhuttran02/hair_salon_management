const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/public": "/public",
        },
      },
      "/flask-api": {
        target: "http://192.168.1.7", 
        changeOrigin: true,
        pathRewrite: {
          "^/flask-api": "",
        },
      },
    },
  },
});
