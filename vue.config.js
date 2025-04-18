const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "https://github.com/KirillBogolyubov/test-app/tree/gh-pages" : "/",
})
