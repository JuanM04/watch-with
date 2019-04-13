require('dotenv').config()
const withCSS = require('@zeit/next-css')
const withSASS = require('@zeit/next-sass')

module.exports = withCSS(withSASS({
  env: {
    SOCKET_ENDPOINT: process.env.SOCKET_ENDPOINT
  }
}))