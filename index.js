#!/usr/bin/env node --harmony

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');

program.version('0.0.1')
  .option('-u, --username [username]', 'Your GitHub username')
  .option('-v, --verbose [value]', 'Display program output, warnings, and error details')
  .option('-t, --timeout [value]', 'GitHub authentication timeout time (default 600ms)')
  .parse(process.argv);

co(function *() {
  var result = {};

  result.ghRepo = yield prompt('GitHub repository name: ');
  var ghUsername = yield prompt('GitHub Username: ');
  var ghPassword = yield prompt.password('GitHub Password: ');
  result.ghHash = 'Basic ' + new Buffer(ghUsername + ':' + ghPassword).toString('base64');
  result.gfRepo = yield prompt('GForge repository name: ');
  var gfUsername = yield prompt('GForge Username:');
  var gfPassword = yield prompt.password('GForge Password:');
  result.gfHash = 'Basic ' + new Buffer(ghUsername + ':' + ghPassword).toString('base64');

  return result;
}).then(function(result) {
  console.log(result.ghHash, result.gfHash);
}, function (err) {
  console.log('Error processing user input to oprah.');
});
