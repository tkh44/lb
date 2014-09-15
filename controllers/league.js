var _ = require('lodash');
var api = require('express-api-helper');
var mongoose = require('mongoose');
var League = require('../models/League');

exports.league = function(req, res, next, id) {
	League.load(id, function(err, league) {
		if (err) return api.serverError(req, res, err);
		if (!league) return api.notFound(req, res);
		req.league = league;
		next();
	});
};

exports.all = function(req, res) {
	League
		.find()
		.populate('teams')
		.populate('manager', 'email profile')
		.exec(function(err, leagues) {
			if (err) return api.serverError(req, res, err);
			api.ok(req, res, leagues);
		});
};

exports.create = function(req, res) {
	api.requireParams(req, res, ['name'], function(err) {
		if (err) return api.serverError(req, res, err);
		var league = {
			name: req.body.name,
			manager: req.user
		};

		League.create(league, function(err, league) {
			if (err) return api.serverError(req, res, err);
			api.ok(req, res, league);
		});

	})
};

exports.get = function(req, res) {
	var league = req.league;
	api.ok(req, res, league);
};

exports.update = function(req, res) {
	var league = req.league;
	league = _.assign(league, req.body);

	league.save(function(err) {
		if (err) api.serverError(req, res, err);
		api.ok(req, res, league);
	});
};

exports.destroy = function(req, res) {
	var league = req.league;

	league.remove(function(err) {
		if (err) return api.serverError(req, res, err);
		res.sendStatus(204);
	});
};

exports.addTeam = function(req, res) {
	var league = req.league;
	var teamId = req.params.leagueTeamId;

	league.teams.push(teamId);
	league.save(function(err) {
		if (err) api.serverError(req, res, err);
		res.sendStatus(204);
	})
};

exports.destroyTeam = function(req, res) {
	var league = req.league;
	var teamId = req.params.leagueTeamId;

	league.teams.pull({'_id': new ObjectId(teamId)});

	league.save(function(err) {
		if (err) api.serverError(req, res, err);
		res.sendStatus(204);
	});
};

