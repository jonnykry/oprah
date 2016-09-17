var https = require('https');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var querystring = require('querystring');

var tempJSON = {
  "statusId": 1,
  "priority": 3,
  "openDate": "2016-09-17 06:11:45 +0000",
  "closeDate": "2016-09-17 06:11:45 +0000",
  "summary": "LET'S GOOOOOOooooooooooo",
  "details": null,
  "tracker": {
    "id": 11546,
    "project": {
      "id": 2267,
      "name": "oprah",
      "unixName": "oprah",
      "description": "Look under your chairs...",
      "homepageUrl": "/gf/project/oprah/",
      "createDate": "2016-09-17 02:48:01 +0000",
      "isPublic": "Y",
      "status": 1,
      "isTemplate": "N",
      "templateProjectId": 2264
    },
    "trackerName": "Tasks",
    "description": "Project Task Tracking",
    "submitInstructions": "",
    "browseInstructions": "",
    "numItems": 6,
    "numItemsOpen": 3,
    "trackerType": 2,
    "details_url": "/api/tracker/11546/detail",
    "api_url": "/api/tracker/11546",
    "fields": [],
    "access_level": null
  },
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
  "submittedBy": {
    "id": 34746,
    "unixName": "nkarasch",
    "password": null,
    "firstname": "Nathan",
    "lastname": "Karasch",
    "email": "nkarasch@iastate.edu",
    "timezone": "America/Chicago",
    "status": 1,
    "externalId": null,
    "isGroup": "N",
    "ccode": "US",
    "language": "en",
    "theme": 1,
    "img_url": "/api/user/nkarasch/avatar",
    "html_url": "/#/user/nkarasch",
    "details_url": "/api/user/nkarasch/details",
    "isSiteAdmin": false,
    "api_url": "/api/user/nkarasch"
  },
  "lastModifiedDate": "2016-09-17 06:11:45 +0000",
  "lastModifiedBy": {
    "id": 34746,
    "unixName": "nkarasch",
    "password": null,
    "firstname": "Nathan",
    "lastname": "Karasch",
    "email": "nkarasch@iastate.edu",
    "timezone": "America/Chicago",
    "status": 1,
    "externalId": null,
    "isGroup": "N",
    "ccode": "US",
    "language": "en",
    "theme": 1,
    "img_url": "/api/user/nkarasch/avatar",
    "html_url": "/#/user/nkarasch",
    "details_url": "/api/user/nkarasch/details",
    "isSiteAdmin": false,
    "api_url": "/api/user/nkarasch"
  },
  "sortOrder": null,
  "parent": 0,
  "hasSubitems": false,
  "subitemsCount": 0,
  "rel": {
    "assignees": [
      {
        "id": 100,
        "unixName": "None",
        "password": null,
        "firstname": "Nobody",
        "lastname": " ",
        "email": "noreply@gforge.org",
        "timezone": "GMT",
        "status": 1,
        "externalId": null,
        "isGroup": "N",
        "ccode": "US",
        "language": "en",
        "theme": 1,
        "img_url": "/api/user/None/avatar",
        "html_url": "/#/user/None",
        "details_url": "/api/user/None/details",
        "isSiteAdmin": false,
        "api_url": "/api/user/None"
      }
    ]
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


function transferIssues(ghUsername, ghRepo, gfUsername, gfHash, gfRepo) {
    getGithubIssues(ghUsername, ghRepo, body);

    body.on('update', function() {
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
  console.log(gfHash);

  var options = {
    host: 'next.gforge.com',
    path: '/api/trackeritem',
    method: 'POST',
    auth: gfHash
  };

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
  req.write(querystring.stringify(tempJSON));
  req.end();
}

module.exports = {
  transferIssues
}
