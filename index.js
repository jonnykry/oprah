#!/usr/bin/env node --harmony

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var it = require('./source/issues-transfer');

program.version('0.0.1')
  .option('-u, --username [username]', 'Your GitHub username')
  .option('-v, --verbose [value]', 'Display program output, warnings, and error details')
  .option('-t, --timeout [value]', 'GitHub authentication timeout time (default 600ms)')
  .parse(process.argv);

co(function *() {
  var result = {};

  // Get GitHub Data
  result.ghRepo = yield prompt('GitHub repository name: \n');
  var ghUsername = yield prompt('GitHub Username: \n');
  var ghPassword = yield prompt.password('GitHub Password: \n');
  result.ghUsername = ghUsername;
  result.ghHash = 'Basic ' + new Buffer(ghUsername + ':' + ghPassword).toString('base64');

  // Get GForge Data
  result.gfRepo = yield prompt('GForge repository name: \n');
  var gfUsername = yield prompt('GForge Username: \n');
  var gfPassword = yield prompt.password('GForge Password: \n');
  result.gfUsername = gfUsername;
  result.gfHash = 'Basic ' + new Buffer(gfUsername + ':' + gfPassword).toString('base64');

  return result;
}).then(function(result) {
  it.transferIssues(result.ghUsername, result.ghRepo, result.gfUsername, result.gfRepo);
}, function (err) {
  console.log('Error processing user input to oprah.');
});
