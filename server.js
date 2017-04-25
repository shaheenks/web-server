var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');
var port = process.env.PORT || 3000;

var todos = [];
var firstId =1;

app.use(bodyParser.json());

app.get('/',function (req, res) {
	res.send('To-Do Api Started');
});

app.get('/todos', function(req, res){
	var queryparams = req.query;
	var filteredToDos = todos;

	if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'true') {
		filteredToDos = _.where(filteredToDos, {completed: true})
	} else if (queryparams.hasOwnProperty('completed') && queryparams.completed === 'false') {
		filteredToDos = _.where(filteredToDos, {completed: false})
	} 

	if (queryparams.hasOwnProperty('q') && _.isString(queryparams.q)) {
		var filteredToDos = _.filter(filteredToDos, function (arr) {
				return arr.description.toLowerCase().indexOf(queryparams.q.toLowerCase())>=0;
		})
	} 

	res.json(filteredToDos);

});

app.get('/todos/:id', function(req, res) {
	var matchedToDo=_.findWhere(todos, {id:parseInt(req.params.id, 10)});

	if (typeof matchedToDo !== 'undefined'){
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length ===0) {
		res.status(404).send();
	} else {
		body.description = body.description.trim();

		body.id = firstId++;
		todos.push(body);
		res.json(body);
	}
});

app.delete('/todos/:id', function (req, res) {
	var matchedToDo = _.findWhere(todos, {id: parseInt(req.params.id, 10)});
	console.log(matchedToDo);
	if (typeof matchedToDo !== 'undefined') {
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

app.post('/todos/:id', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	var validAttr = {};

	var matchedToDo = _.findWhere(todos, {id: parseInt(req.params.id, 10)});
	if (!matchedToDo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttr.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		res.status(404).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttr.description = body.description.trim();
	} else if (body.hasOwnProperty('description')) {
		res.status(404).send();
	}

	_.extend(matchedToDo, validAttr);
	res.json(matchedToDo);

});

app.listen(port, function () {
	console.log('Express Server Started at ' + port);
});