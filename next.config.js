require('dotenv').config()
const withCSS = require('@zeit/next-css')
const withSASS = require('@zeit/next-sass')
const withOffline = require('next-offline')

const config = {
  env: {
    SOCKET_ENDPOINT: process.env.SOCKET_ENDPOINT
  }
}

module.exports = withOffline(withCSS(withSASS(config)))