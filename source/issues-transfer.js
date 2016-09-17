var https = require('https');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var querystring = require('querystring');

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
      var out = getJson(body.userdata.items[0], body.data[0], body.trackerdata.items[0]);
      postGforgeTrackers(out, gfHash);
    });
}

// Private Functions

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
        console.log("Error: " + e.message);
    });
}

/*
{ paging: { page_size: 20, page_num: 1, sort_field: 'id', sort_dir: 'asc' },
  items: [ [Object] ],
  links: [] },
*/

function getGfUser(username, gfHash){
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

/*
tracker:
  { paging: { page_size: 20, page_num: 1, sort_field: 'id', sort_dir: 'asc' },
    items: [],
    links: [] },
*/

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

function postGforgeTrackers(data, gfHash) {
  var options = {
    host: 'next.gforge.com',
    path: '/api/trackeritem',
    method: 'POST',
    auth: gfHash
  };

  console.log(data);

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      // ??
    });
  });

  req.on('error', function(e) {
    console.log("Error: " + e.message);
  });

  req.write(querystring.stringify(data));
  req.end();
}

function getJson(userobj, issue, tracker) {
  var json = {
    "statusId": 1,
    "priority": 1,
    "openDate": issue['created_at'], // (with some parsing done)
    "closeDate": issue['closed_at'], // (with some parsing done, see if null is allowed)
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
    "lastModifiedDate": issue['updated_at'], //(with some parsing done)
    "lastModifiedBy": userobj,
    "sortOrder": null,
    "parent": 0,
    "hasSubitems": false,
    "subitemsCount": 0,
    "rel": {
      "assignees": userobj
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
