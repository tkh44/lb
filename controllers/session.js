var mongoose = require('mongoose'),
	passport = require('passport'),
	secrets = require('../config/secrets'),
	jwt = require('jsonwebtoken'),
	api = require('express-api-helper');

/**
 * Session
 * returns info on authenticated user
 */
exports.session = function (req, res) {
	var token = jwt.sign(req.user, secrets.jwtSecret, { expiresInMinutes: 60*5});
	api.ok(req, res, token);
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
	if(req.user) {
		req.logout();
		api.ok(req, res, {});
	} else {
		api.badRequest(req, res, "Not logged in.");
	}
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
	req.assert('email', 'Email is not valid').isEmail();
	req.assert('password', 'Password cannot be blank').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		return api.unauthorized(req, res);
	}

	passport.authenticate('local', function(err, user, info) {
		if (err || info) return api.serverError(req, res, err);
		if (!user) {
			return api.unauthorized(req, res);
		}

		var token = jwt.sign(user, secrets.jwtSecret, { expiresInMinutes: 60*5});

		api.ok(req, res, {token: token});
	})(req, res, next);
};