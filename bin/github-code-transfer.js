#! /usr/bin/env node
var shell = require("shelljs");

var verbose = false;


// Check if user has git installed
if (!shell.which("git")) {
    echo("Sorry, this script requires git.");
    exit(1);
}

// Log that the script is beginning...
console.log("Transferring Code from GitHub to GForge...");
shell.config.silent = !verbose;

// Tracks all remote branches
// var gitBranch = shell.exec("git branch -r", {silent: !verbose}).stdout;
// var grepResults = shell.grep("-v", "\->");
shell.exec("git branch -r | grep -v '\->' | while read remote; do git branch --track \"${remote#origin/}\" \"$remote\"; done");

// Pull down all branches
shell.exec("git pull --all");

