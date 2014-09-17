var unirest = require('unirest');
var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/User');
var _ = require('lodash');
var async = require('async');

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
	console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

unirest.get('http://api.randomuser.me/?results=40').end(function(response) {
	var users = response.body.results;

	async.each(users, function(obj, cb) {
		var user = obj.user;

		var newUser = new User({
			email: user.email,
			password: 'super',
			profile: {
				name: user.name,
				gender: user.gender,
				location: user.location,
				picture: user.picture
			}
		});

		console.log(newUser, '\n\n');

		User.findOne({ email: user.email }, function(err, existingUser) {
			if (!existingUser) {
				newUser.save(function(err) {
					return cb(err ? err : null);
				});
			}
		});
	}, function(err) {
		console.log(err ? err : '\n\n==========SUCCESS==========')
		process.exit();
	});
});



