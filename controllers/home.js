var async = require('async');
var League = require('../models/League');
var Team = require('../models/Team');
var Player = require('../models/Player');
var _ = require('lodash');


var getUserData = function(userId, cb) {
	async.parallel({
		leagues: function(cb) {
			League.getByManager(userId, cb);
		},
		teams: function(cb) {
			Team.getByManager(userId, cb);
		},
		players: function(cb) {
			Player.getByUser(userId, cb);
		}
	}, cb);
};

exports.index = function(req, res) {
	var responseData = {
		title: 'Home'
	};

	if (req.user) {
		getUserData(req.user.id, function(err, results) {
			if (err) return err;
			res.render('home', _.assign(responseData, {
				leagues: results.leagues,
				teams: results.teams,
				players: results.players
			}));
		});
	} else {
		res.render('home', responseData);
	}


};
