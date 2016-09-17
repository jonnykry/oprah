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
  result.ghUsername = yield prompt('GitHub Username: ');
  result.gfRepo = yield prompt('GForge repository name: ');
  result.gfUsername = yield prompt('Enter GForge Username:');
  result.gfPassword = yield prompt.password('Enter GForge Password:');

  return result;
}).then(function(result) {
  // TODO: Call their functions with result

}, function (err) {
  console.log('Error processing user input to oprah.');
});

// TODO: Auth the user for GitHub
