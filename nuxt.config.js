const colors = require("vuetify/es5/util/colors").default;

module.exports = {
  head: {
    title: "starter",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && process.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    }
  },
  modules: ["~/io", "nuxt-clipboard2"],
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    customVariables: ["~/assets/scss/variables.scss"],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    },
    defaultAssets: {
      font: true,
      icons: "md"
    },
    icons: {
      iconfont: "md"
    }
  },
  env: {
    WS_URL: process.env.WS_URL || "http://sapos.gbandres.com"
  }
};
