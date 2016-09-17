#! /usr/bin/env node
var github = require('octonode');

// , github_password, github_repo, gforge_username, gforge_password, gforge_repo
function transfer_issues(github_username, github_repo){
    var client = github.client();

    client.get('/repos/csteamengine/MySnippets/issues', {}, function (err, status, body, headers) {
        body.forEach(function(curr){
            console.log(curr['title']);
        });
        // console.log(body); //json object
    });
}