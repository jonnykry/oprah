var https = require('https');
var http = require('http');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();
var querystring = require('querystring');



function transferIssues(ghUsername, ghRepo, gfUsername, gfHash, gfRepo) {
    getGithubIssues(ghUsername, ghRepo);

    body.on('update', function() {
      console.log("update");
      get_user(gfUsername, gfHash);
    });
    body.on('user_get', function(){
      console.log("user_get");
      get_tracker(gfRepo, gfHash);
    });

    body.on('tracker_get',function(){
      var out = get_json(body.userdata, body.data, body.trackerdata);
      console.log(out);
      postGforgeTrackers(out, gfHash);
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

function postGforgeTrackers(data, gfHash) {
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
  req.write(querystring.stringify(data));
  req.end();
}

function get_user(username, gfHash){
  var options = {
    host: 'next.gforge.com',
    path: '/api/user?unixName='+username+'&page_num=1&page_size=20',
    method: 'GET',
    auth: gfHash
  };
  console.log(options);
  http.get(options, function(res) {
    body.userdata = "";

    res.on("data", function(chunk) {
      body.userdata += chunk;
    });

    res.on('end', function(){
      body.userdata = JSON.parse(body.userdata);
      // console.log(body.userdata);
      body.emit('user_get');
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

}

function get_json(userobj, issue, tracker){
  var json = {
    "statusId": 1,
    "priority": 1,
    "openDate": issue['created_at'], //(with some parsing done)
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



function get_tracker(gfRepo, gfHash){
  //TODO get whole tracker();
  var options = {
    host: 'next.gforge.com',
    path: '/api/tracker/?trackerName='+gfRepo+'&page_num=1&page_size=20',
    method: 'GET',
    auth: gfHash
  };
  console.log(options);
  http.get(options, function(res) {
    body.trackerdata = "";

    res.on("data", function(chunk) {
      body.trackerdata += chunk;
    });

    res.on('end', function(){
      body.trackerdata = JSON.parse(body.trackerdata);
      // console.log(body.userdata);
      body.emit('tracker_get');
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
}


module.exports = {
  transferIssues,
  get_user
};
