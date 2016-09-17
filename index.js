#!/usr/bin/env node

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var it = require('./source/issues-transfer');
var ct = require('./source/code-transfer');

program.version('0.0.1')
  .option('-u, --githubusername [ghUsername]', 'Your GitHub username')
  .option('-U, --gforgeusername [gfUsername]', 'Your GForge username')
  .option('-v, --verbose', 'Display program output, warnings, and error details', incrementFlag, 0)
  .option('-t, --timeout [timeout]', 'GitHub authentication timeout time (default 600ms)')
  .option('-i, --transferissues', 'Only transfers Issues from GitHub to GForge', incrementFlag, 0)
  .option('-c, --transfercode', 'Only transfers Code from GitHub to GForge', incrementFlag, 0)
  .parse(process.argv);

co(function *() {
  var result = {};

  // Get GitHub Data
  result.ghRepo = yield prompt('GitHub repository name: \n');
  var ghUsername = (program.githubusername) ? program.githubusername : yield prompt('GitHub Username: \n');
  var ghPassword = yield prompt.password('GitHub Password: \n');
  var ghAuthToken = yield prompt.password('GitHub Auth Token (optional): \n');
  result.ghUsername = ghUsername;
  result.ghHash = ghUsername + ':' + ghPassword;
  result.ghAuthToken = ghAuthToken;

  // Get GForge Data
  result.gfRepo = yield prompt('GForge repository name: \n');
  var gfUsername = (program.gforgeusername) ? program.gforgeusername : yield prompt('GForge Username: \n');
  var gfPassword = yield prompt.password('GForge Password: \n');
  result.gfUsername = gfUsername;
  result.gfHash = gfUsername + ':' + gfPassword;

  // Get the remaining command line arguments
  result.verbose = (program.verbose);
  result.transferIssues = (runAll() || program.transferissues);
  result.transferCode = (runAll() || program.transfercode);

  return result;
}).then(function(result) {
  if (result.transferIssues) {
      it.transferIssues(result.ghUsername, result.ghRepo, result.gfUsername, result.gfHash, result.gfRepo);
  }
  // if (result.transferCode) {
  //   ct.transferCode(result.ghRepo, result.ghUsername, result.gfRepo, result.gfUsername, result.verbose);
  // }
}, function (err) {
  console.log('Error processing user input to oprah.');
});

function incrementFlag(f, total) {
  return total + 1;
}

function runAll() {
  return (program.transferissues && program.transfercode || !program.transferissues && !program.transfercode);
}
