var _ = require('lodash');
var api = require('express-api-helper');
var mongoose = require('mongoose');
var Team = require('../models/Team');

exports.team = function(req, res, next, id) {
	Team.load(id, function(err, team) {
		if (err) return api.serverError(req, res, err);
		if (!team) return api.notFound(req, res);
		req.team = team;
		next();
	});
};

exports.all = function(req, res) {
	Team.find({}, function(err, teams) {
		if (err) return api.serverError(req, res, err);
		api.ok(req, res, teams);
	});
};

exports.create = function(req, res) {
	api.requireParams(req, res, ['name'], function(err) {
		if (err) return api.serverError(req, res, err);
		var team = {
			name: req.body.name
		};

		Team.create(team, function(err, team) {
			if (err) return api.serverError(req, res, err);
			api.ok(req, res, team);
		});

	})
};

exports.get = function(req, res) {
	var team = req.team;
	api.ok(req, res, team);
};

exports.update = function(req, res) {
	var team = req.team;
	team = _.assign(team, req.body);

	team.save(function(err) {
		if (err) api.serverError(req, res, err);
		api.ok(req, res, team);
	});
};

exports.destroy = function(req, res) {
	var team = req.team;

	team.remove(function(err) {
		if (err) return api.serverError(req, res, err);
		res.sendStatus(204);
	});
};

exports.addPlayer = function(req, res) {
	var team = req.team;
	var playerId = req.body._id;

	team.players.push(playerId);
	team.save(function(err) {
		if (err) api.serverError(req, res, err);
		api.ok(req.res, team);
	})
};
