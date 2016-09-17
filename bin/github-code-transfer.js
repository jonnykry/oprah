#! /usr/bin/env node
var shell = require("shelljs");

// Testing purposes only
githubCodeTransfer("https://someurl", false);


function githubCodeTransfer(gforgeRepoURL, verbose) {
    // Check if user has git installed
    checkGitInstalled();
    
    // Begin script
    console.log("Transferring Code from GitHub to GForge...");
    shell.config.silent = !verbose;
    // TODO: Uncomment below after complete
    // attemptToCheckoutMaster();

    // Tracks all remote branches
    shell.exec("git branch -r | grep -v '\->' | while read remote; do git branch --track \"${remote#origin/}\" \"$remote\"; done");

    // Pull down all branches
    shell.exec("git fetch --all");
    shell.exec("git pull --all");

    // Setup gforge remote
    setupGforgeRemote(gforgeRepoURL);

    // Push to new remote
    shell.exec("git push " + gforgeRepoURL + " --all");
    shell.exec("git push " + gforgeRepoURL + " --tags");
}

function checkGitInstalled() {
    if (!shell.which("git")) {
        shell.echo("Sorry, this script requires git.");
        shell.exit(1);
    }
}

function attemptToCheckoutMaster() {
    var commandStdOut;
    var commandStdErr;
    shell.exec("git checkout master", function(_, stdout, stderr) {
        commandStdOut = stdout;
        commandStdErr = stderr;
    });
    if (commandStdErr) {
        console.log(commandStdErr);
        shell.exit(1);
    }
}

function setupGforgeRemote(gforgeRepoURL) {
    var remotes = shell.exec("git remote -v").stdout;
    if (remotes.includes("gforge)")) {
        shell.exec("git remote remove gforge");
    }
    shell.exec("git remote add gforge " + gforgeRepoURL);
}
