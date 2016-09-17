#! /usr/bin/env node
const https = require('https');

function transfer_issues(github_username, github_password, github_repo, gforge_username, gforge_password, gforge_repo){
    var github_issues_json = get_github_issues(github_username, github_repo);
    post_gforge_trackers(github_issues_json, gforge_username, gforge_password, gforge_repo);
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
            // return json;
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function post_gforge_trackers(object, username, password, id){
  var gForce = {
    host: 'next.gforge.com',
    path: '/api/trackeritem/' + id,
    method: 'POST',
    headers: {'user-agent': 'node.js'},
    auth: 'Basic ' + new Buffer("justintw" + ':' + "123qwe").toString('base64')
  };

  var req = https.request(gForce, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  
  console.log(object[0])
  // write data to request body
  req.write("Test");
  req.end();
}

get_github_issues('csteamengine','MySnippets');