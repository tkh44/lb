var _ = require('lodash');
var api = require('express-api-helper');
var mongoose = require('mongoose');
var Game = require('../models/Game');

exports.game = function(req, res, next, id) {
	Game.load(id, function(err, game) {
		if (err) return api.serverError(req, res, err);
		if (!game) return api.notFound(req, res);
		req.game = game;
		next();
	});
};

exports.all = function(req, res) {
	Game
		.find()
		.populate('teams')
		.populate('league')
		.exec(function(err, games) {
			if (err) return api.serverError(req, res, err);
			api.ok(req, res, games);
		});
};

exports.create = function(req, res) {
	api.requireParams(req, res, ['name'], function(err) {
		if (err) return api.serverError(req, res, err);
		var game = req.body;

		Game.create(game, function(err, game) {
			if (err) return api.serverError(req, res, err);
			// TODO: Make these part of api-helper to respond 201 with data
			api.ok(req, res, game);
		});

	})
};

exports.get = function(req, res) {
	var game = req.game;
	api.ok(req, res, game);
};

exports.update = function(req, res) {
	var game = req.game;
	game = _.assign(game, req.body);

	game.save(function(err) {
		if (err) api.serverError(req, res, err);
		api.ok(req, res, game);
	});
};

exports.destroy = function(req, res) {
	var game = req.game;

	game.remove(function(err) {
		if (err) return api.serverError(req, res, err);
		res.sendStatus(204);
	});
};

exports.addTeam = function(req, res) {
	var game = req.game;
	var teamId = req.team._id;

	game.teams.push(teamId);
	game.save(function(err) {
		if (err) api.serverError(req, res, err);
		res.sendStatus(204);
	})
};

exports.destroyTeam = function(req, res) {
	var game = req.game;
	var teamId = req.team._id;

	game.teams.pull({'_id': new ObjectId(teamId)});

	game.save(function(err) {
		if (err) api.serverError(req, res, err);
		res.sendStatus(204);
	});
};

