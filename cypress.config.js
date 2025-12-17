const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://app.diagrams.net',
    viewportWidth: 1280,
    viewportHeight: 800,
    chromeWebSecurity: false
  }
})
