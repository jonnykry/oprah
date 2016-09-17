#! /usr/bin/env node
var shell = require("shelljs");
var urlPrefix = "https://gforge.com/git/";


function transferCode(gfRepo, verbose) {
    // Check if user has git installed
    checkGitInstalled();
    
    // Begin script
    console.log("Transferring Code from GitHub to GForge...");
    shell.config.silent = !verbose;
    shell.exec("git config --global credential.helper 'cache --timeout=600'");
    attemptToCheckoutMaster();

    // Tracks all remote branches
    shell.exec("git branch -r | grep -v '\\->' | while read remote; do git branch --track \"${remote#origin/}\" \"$remote\"; done");

    // Pull down all branches
    shell.exec("git fetch --all");
    shell.exec("git pull --all");

    // Setup gforge remote
    setupGforgeRemote(gfRepo);

    // Push to new remote
    shell.exec("git push gforge --all");
    shell.exec("git push gforge --tags");

    // Reset credential.helper cache
    shell.exec("git config --global credential.helper 'cache --timeout=0'");
}


function checkGitInstalled(testing=false) {
    if (!testing && !shell.which("git")) {
        shell.echo("Sorry, this script requires git.");
        shell.exit(1);
    } else if (testing && !shell.which("gitnotinstalled")) {
        throwError();
    }
}

function attemptToCheckoutMaster(testing=false) {
    var stderr;
    if (!testing) {
        stderr = shell.exec("git checkout master").stderr;
        if (stderr) {
            shell.exit(1);
        }
    } else {
        stderr = shell.exec("git checkout master").stderr;
        if (stderr) {
            throwError();
        }
    }
}

function setupGforgeRemote(gfRepo) {
    var url = urlPrefix + gfRepo;
    shell.exec("git remote remove gforge 2>/dev/null");
    shell.exec("git remote add gforge " + url);
}


module.exports = {
    transferCode,
    checkGitInstalled,
    attemptToCheckoutMaster,
    setupGforgeRemote
};
