#!/usr/bin/env node
//
// Build the web site.
//

var fs = require('fs')
var SP = require('static-plus')
var SITE_ROOT = '/browserid/_design/browserid/_rewrite'

function main() {
  var DB = process.argv[2];
  if(!DB)
    return console.error('Usage: build.js <database_url>')
  console.log('Pushing: %s', DB)

  var builder = new SP.Builder
  builder.read_only = true
  builder.target = DB + '/_design/browserid'

  builder.on('die', function(reason) {
    console.error('Builder died: %j', reason)
  })

  builder.template        = __dirname + '/page.tmpl.html'
  builder.helpers.site    = function(ctx) { return SITE_ROOT }
  builder.helpers.couchdb = function(ctx) { return SITE_ROOT + '/_couchdb' }

  // The entire site has only one page, the landing page.
  builder.doc({ '_id'   : ''
              , 'title' : 'BrowserID on CouchDB'
              , 'github': 'https://github.com/iriscouch/browserid_couchdb/blob/master/example/page.tmpl.html'
              })

  builder.deploy()
  builder.on('deploy', function(result) {
    console.log('Deployed: %s', result)
  })
}

if(require.main === module)
  main()
