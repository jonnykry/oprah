#! /usr/bin/env node
const https = require('https');

function transfer_issues(github_username, github_password, github_repo, gforge_username, gforge_password, gforge_repo){
    var github_issues_json = get_github_issues(github_username, github_repo);

    post_gforge_tracker(json, gforge_username, gforge_password, gforge_repo);


}


// , github_password, github_repo, gforge_username, gforge_password, gforge_repo
function get_github_issues(github_username, github_repo){


    var url = {
        host: 'api.github.com',
        path: '/repos/'+github_username+'/'+ github_repo +'/issues',
        method: 'GET',
        headers: {'user-agent': github_username}
    };

    https.get(url, function(res) {

        console.log("Got response: " + res.statusCode);
        var body = "";
        res.on("data", function(chunk) {
            body += chunk;
        });
        res.on('end', function(){
            var json = JSON.parse(body);
            console.log(json[0]);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function post_gforge_trackers(json, username, password, repo){
    //TODO
}

get_github_issues('csteamengine', 'MySnippets');