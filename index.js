#!/usr/bin/env node --harmony

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var https = require('https');

program.version('0.0.1')
  .option('-u, --username [username]', 'Your GitHub username')
  .option('-v, --verbose [value]', 'Display program output, warnings, and error details')
  .option('-t, --timeout [value]', 'GitHub authentication timeout time (default 600ms)')
  .parse(process.argv);

co(function *() {
  var result = {};

  result.ghRepo = yield prompt('GitHub repository name: ');
  result.ghUsername = yield prompt('GitHub Username: ');
  result.ghPassword = yield prompt.password('GitHub Password: ');
  result.gfRepo = yield prompt('GForge repository name: ');
  result.gfUsername = yield prompt('GForge Username:');
  result.gfPassword = yield prompt.password('GForge Password:');

  return result;
}).then(function(result) {
  var ghAuthCode = 'Basic ' + new Buffer(result.ghUsername + ':' + result.ghPassword).toString('base64');
  var gfAuthCode = 'Basic ' + new Buffer(result.gfUsername + ':' + result.gfPassword).toString('base64');

}, function (err) {
  console.log('Error processing user input to oprah.');
});
