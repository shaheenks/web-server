var express = require('express');
var app = express();
var port = 3000;

var middleware = require('./middleware.js')

app.use(middleware.logger);

app.get('/about', middleware.requireAuthentication,function (req, res) {
	res.send('Hello Express.');
});

app.use(express.static(__dirname+'/public'));

app.listen(port, function () {
	console.log('Express Server Started at ' + port);
});