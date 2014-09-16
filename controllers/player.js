var _ = require('lodash');
var api = require('express-api-helper');
var mongoose = require('mongoose');
var Player = require('../models/Player');

exports.player = function(req, res, next, id) {
	Player.load(id, function(err, player) {
		if (err) return api.serverError(req, res, err);
		if (!player) return api.notFound(req, res);
		req.player = player;
		next();
	});
};

exports.all = function(req, res) {
	Player.find({}, function(err, players) {
		if (err) return api.serverError(req, res, err);
		api.ok(req, res, players);
	});
};

exports.create = function(req, res) {
	api.requireParams(req, res, ['name'], function(err) {
		if (err) return api.serverError(req, res, err);
		var player = {
			name: req.body.name,
			user: req.body.user || req.user
		};

		Player.create(player, function(err, player) {
			if (err) return api.serverError(req, res, err);
			api.ok(req, res, player);
		});

	})
};

exports.get = function(req, res) {
	var player = req.player;
	api.ok(req, res, player);
};

exports.update = function(req, res) {
	var player = req.player;

	player = _.assign(player, req.body);

	player.save(function(err) {
		if (err) api.serverError(req, res, err);
		api.ok(req, res, player);
	});
};

exports.destroy = function(req, res) {
	var player = req.player;

	player.remove(function(err) {
		if (err) return api.serverError(req, res, err);
		res.sendStatus(204);
	});
};


