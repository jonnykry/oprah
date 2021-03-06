var https = require('https');
var http = require('http');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var querystring = require('querystring');
var colors = require("colors");

// Public Functions

exports.transferIssues = function(ghUsername, ghRepo, gfUsername, gfHash, gfRepo) {
    getGithubIssues(ghUsername, ghRepo);

    // Event Listeners

    body.on('update', function() {
      getGfUser(gfUsername, gfHash);
    });

    body.on('userGet', function () {
      getProject(gfRepo, gfHash);
    });

    body.on('projectGet',function () {
      getTracker(gfRepo, gfHash);
    });

    body.on('trackerGet',function () {
      for(i = 0; i < body.data.length; i++) {
        var out = getJson(body.userdata.items[0], body.data[i], body.trackerdata.items[0]);
        postGforgeTrackers(out, gfHash, i == body.data.length - 1);
      }
    });
}

// Private Functions

function getGithubIssues(ghUsername, ghRepo) {
    var options = {
        host: 'api.github.com',
        path: '/repos/' + ghUsername + '/' + ghRepo + '/issues?state=all',
        method: 'GET',
        headers: {
          'user-agent': ghUsername
        }
    };

    https.get(options, function(res) {
        body.data = "";

        res.on("data", function(chunk) {
            body.data += chunk;
        });

        res.on('end', function(){
            body.data = JSON.parse(body.data);
            body.emit('update');
        });
    }).on('error', function(e) {
        console.log("Error: " + e.message);
    });
}

function getGfUser(username, gfHash) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/user?unixName=' + username,
    method: 'GET',
    auth: gfHash
  };

  https.get(options, function(res) {
    body.userdata = "";

    res.on("data", function(chunk) {
      body.userdata += chunk;
    });

    res.on('end', function() {
      body.userdata = JSON.parse(body.userdata);
      body.emit('userGet');
    });
  }).on('error', function(e) {
    console.log("Error: " + e.message);
  });
}

function getProject(gfRepo, gfHash) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/project?unixName=' + gfRepo,
    method: 'GET',
    auth: gfHash
  };

  https.get(options, function(res) {
    body.projectdata = "";

    res.on('data', function(chunk) {
      body.projectdata += chunk;
    });

    res.on('end', function(){
      body.projectdata = JSON.parse(body.projectdata);
      body.emit('projectGet');
    });
  }).on('error', function(e) {
    console.log("Error: " + e.message);
  });
}

function getTracker(gfRepo, gfHash) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/tracker/?project=' + body.projectdata.items[0].id,
    method: 'GET',
    auth: gfHash
  };

  https.get(options, function(res) {
    body.trackerdata = "";

    res.on('data', function(chunk) {
      body.trackerdata += chunk;
    });

    res.on('end', function(){
      body.trackerdata = JSON.parse(body.trackerdata);
      body.emit('trackerGet');
    });
  }).on('error', function(e) {
    console.log("Error: " + e.message);
  });
}

function postGforgeTrackers(data, gfHash, isFinished) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/trackeritem',
    method: 'POST',
    auth: gfHash,
    headers: {
        'Content-Type': 'application/json'
    }
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('New tracking item created at: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log("Error: " + e.message);
  });

  var out = JSON.stringify(data);

  req.write(out);

  if (isFinished) {
    console.log(colors.green("Transferring Code from GitHub to GForge Complete!"));
    console.log(colors.green("Transferring GitHub issues to GForge tracker items..."));
  }

  req.end();
}

function getJson(userobj, issue, tracker) {
  var json = {
    "statusId": 1,
    "priority": 1,
    "openDate": issue['created_at'],
    "closeDate": issue['closed_at'],
    "summary": issue['title'],
    "details": issue['body'],
    "tracker": tracker,
    "waitingFor": 100,
    "sprint": {
      "id": null,
      "alias": "sprint",
      "fieldId": null,
      "fieldName": "sprint",
      "fieldType": null,
      "fieldData": null,
      "fieldElements": null,
      "fieldOrder": null
    },
    "submittedBy": userobj,
    "lastModifiedDate": issue['updated_at'],
    "lastModifiedBy": userobj,
    "sortOrder": null,
    "parent": 0,
    "hasSubitems": false,
    "subitemsCount": 0,
    "rel": {
      "assignees": [userobj]
    },
    "extraFields": {
      "status": {
        "id": 67773,
        "alias": "status",
        "fieldId": 67773,
        "fieldName": "Status",
        "fieldType": 7,
        "fieldData": {
          "id": 280792,
          "alias": "todo",
          "elementName": "To Do",
          "statusId": 1
        },
        "fieldElements": null,
        "fieldOrder": 0
      }
    }
  };
  return json;
}
