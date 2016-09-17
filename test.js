/**
 * Created by gregory on 9/17/16.
 */

const https = require('https');
var url = {
    host: 'api.github.com',
    path: '/',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
};

https.get(url, function(res) {

    console.log("Got response: " + res.statusCode);
    var body = "";
    res.on("data", function(chunk) {
        body += chunk;
    });
    res.on('end', function(){
        var json = JSON.parse(body);
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});