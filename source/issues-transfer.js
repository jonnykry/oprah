var https = require('https');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var querystring = require('querystring');

function transferIssues(ghUsername, ghRepo, gfUsername, gfHash, gfRepo) {
    getGithubIssues(ghUsername, ghRepo, body);

    body.on('update', function() {
      postGforgeTrackers(body.data, gfUsername, gfHash, gfRepo);
    });
}

function getGithubIssues(ghUsername, ghRepo) {
    var url = {
        host: 'api.github.com',
        path: '/repos/' + ghUsername + '/' + ghRepo + '/issues',
        method: 'GET',
        headers: {'user-agent': ghUsername}
    };

    https.get(url, function(res) {
        body.data = "";

        res.on("data", function(chunk) {
            body.data += chunk;
        });

        res.on('end', function(){
            body.data = JSON.parse(body.data);
            body.emit('update');
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

function postGforgeTrackers(data, gfHash, id) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/trackeritem',
    method: 'POST',
    auth: gfHash
  };

  console.log(options);

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(querystring.stringify(''));
  req.end();
}

module.exports = {
  transferIssues
};
