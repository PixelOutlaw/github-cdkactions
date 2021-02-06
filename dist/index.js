
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./github-cdkactions.cjs.production.min.js')
} else {
  module.exports = require('./github-cdkactions.cjs.development.js')
}
