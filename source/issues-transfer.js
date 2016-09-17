var https = require('https');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();

function transferIssues(ghUsername, ghRepo, gfUsername, gfHash, gfRepo) {
    getGithubIssues(ghUsername, ghRepo, body);

    body.on('update', function() {
      console.log('Hooray!', body.data);
      postGforgeTrackers(body.data, gfUsername, gfHash, gfRepo);
    });
}

// TODO: Do we need the GH or GF user/pass hash?
function getGithubIssues(ghUsername, ghRepo) {
    var url = {
        host: 'api.github.com',
        path: '/repos/' + ghUsername + '/' + ghRepo + '/issues',
        method: 'GET',
        headers: {'user-agent': ghUsername}
    };

    https.get(url, function(res) {
        console.log("Got response: " + res.statusCode);

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


// TODO: Figure out why user auth is not working
function postGforgeTrackers(object, gfHash, id) {
  var gForce = {
    host: 'next.gforge.com',
    path: '/api/trackeritem',
    method: 'POST',
    headers: {'user-agent': '.js'},
    auth: gfHash
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

module.exports = {
  transferIssues
}
