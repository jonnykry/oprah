



































const https = require('https');
var gitURL = {
  host: 'api.github.com',
  path: '/',
  method: 'GET',
  headers: {'user-agent': 'node.js'}
};

https.get(url, function(res) {
  res.on("data", function(chunk) {
    console.log("BODY: " + chunk);
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});




var gForce = {
  host: 'next.gforge.com',
  path: '/api/trackeritem/',
  method: 'POST',
  headers: {'user-agent': 'node.js'}
}

var req = http.request(gForce, function(res) {
  gForce["path"] = '/api/trackeritem/' + object["userID"];
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

// write data to request body
req.write('data\n');
req.write('data\n');
req.end();