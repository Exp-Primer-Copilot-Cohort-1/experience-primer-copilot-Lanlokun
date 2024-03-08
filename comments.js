// Create web server

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var comments = require('./comments.json');


var server = http.createServer(function(req, res) {
    var url_parts = url.parse(req.url);
    var path = url_parts.pathname;
    var query = url_parts.query;
    
    if (path === '/comments' && req.method === 'GET') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(comments));
    } else if (path === '/comments' && req.method === 'POST') {
        var body = '';
        req.on('data', function(data) {
        body += data;
        });
        req.on('end', function() {
        var comment = qs.parse(body);
        comments.push(comment);
        fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
            if (err) {
            console.log(err);
            }
        });
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(comment));
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
    });

server.listen(3000, function() {
    console.log('Server is listening on port 3000');
}
);


