var https = require('https');
var http = require('http');
var EventEmitter = require("events").EventEmitter;
var querystring = require('querystring');
bodies = [new EventEmitter(), new EventEmitter(), new EventEmitter(), new EventEmitter(), new EventEmitter(), new EventEmitter()]
// Public Functions

exports.transferIssues = function(ghUsername, ghRepo, gfUsername, gfHash, gfRepo) {
  for (var page = 1; page < 5; page++)
  {
    console.log(page)
    getGithubIssues(ghUsername, ghRepo, page)

    bodies[page].on('update', function() {
      getGfUser(gfUsername, gfHash, page);
    });

    bodies[page].on('userGet', function () {
      getProject(gfRepo, gfHash, page);
    });

    bodies[page].on('projectGet',function () {
      getTracker(gfRepo, gfHash, page);
    });

    bodies[page].on('trackerGet',function () {
      for(i = 0;i< bodies[page].data.length;i++){
        var out = getJson(bodies[page].userdata.items[0], bodies[page].data[i], bodies[page].trackerdata.items[0]);
        postGforgeTrackers(out, gfHash);
      }
    }); 
  }
}

// Private Functions

function getGithubIssues(ghUsername, ghRepo, page) {
    var url = {
        host: 'api.github.com',
        path: '/repos/' + ghUsername + '/' + ghRepo + '/issues?state=all&page=' + page + '&per_page=1',
        method: 'GET',
        headers: {'user-agent': ghUsername}
    };

    https.get(url, function(res) {
        bodies[page].data = ""
        res.on("data", function(chunk) {
            bodies[page].data += chunk;
        });

        res.on('end', function(){
            bodies[page].data = JSON.parse(bodies[page].data);
            bodies[page].emit('update');
        });
    }).on('error', function(e) {
        console.log("Error: " + e.message);
    });
}

function getGfUser(username, gfHash, page){
  var options = {
    host: 'next.gforge.com',
    path: '/api/user?unixName=' + username,
    method: 'GET',
    auth: gfHash
  };

  https.get(options, function(res) {
    bodies[page].userdata = "";

    res.on("data", function(chunk) {
      bodies[page].userdata += chunk;
    });

    res.on('end', function() {
      bodies[page].userdata = JSON.parse(bodies[page].userdata);
      bodies[page].emit('userGet');
    });
  }).on('error', function(e) {
    console.log("Error: " + e.message);
  });
}

function getProject(gfRepo, gfHash, page) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/project?unixName=' + gfRepo,
    method: 'GET',
    auth: gfHash
  };

  https.get(options, function(res) {
    bodies[page].projectdata = "";

    res.on('data', function(chunk) {
      bodies[page].projectdata += chunk;
    });

    res.on('end', function(){
      bodies[page].projectdata = JSON.parse(bodies[page].projectdata);
      bodies[page].emit('projectGet');
    });
  }).on('error', function(e) {
    console.log("Error: " + e.message);
  });
}

function getTracker(gfRepo, gfHash, page) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/tracker/?project=' + bodies[page].projectdata.items[0].id,
    method: 'GET',
    auth: gfHash
  };

  https.get(options, function(res) {
    bodies[page].trackerdata = "";

    res.on('data', function(chunk) {
      bodies[page].trackerdata += chunk;
    });

    res.on('end', function(){
      bodies[page].trackerdata = JSON.parse(bodies[page].trackerdata);
      bodies[page].emit('trackerGet');
    });
  }).on('error', function(e) {
    console.log("Error: " + e.message);
  });
}

function postGforgeTrackers(data, gfHash) {
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
        console.log('Response: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log("Error: " + e.message);
  });

  var out = JSON.stringify(data);
  console.log(out);

  req.write(out);
  req.end();
}

function getJson(userobj, issue, tracker) {
  var json = {
    "statusId": 1,
    "priority": 1,
    "openDate": issue['created_at'],
    "closeDate": issue['closed_at'],
    "summary": issue['title'],
    "details": issue['bodies[page]'],
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
