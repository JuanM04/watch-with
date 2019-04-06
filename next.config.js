require('dotenv').config()
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  env: {
    SOCKET_ENDPOINT: process.env.SOCKET_ENDPOINT
  }
})