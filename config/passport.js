var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/User');
var secrets = require('./secrets');
var api = require('express-api-helper');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Sign in using Email and Password.
passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      }
    });
  });
}));

// Sign in with basic HTTP auth
passport.use(new BasicStrategy(function(email, password, done) {
	User.findOne({email: email}, function(err, user) {
		if (!user) return done(null, false, {message: 'Unauthorized'});
		user.comparePassword(password, function(err, isMatch) {
			return isMatch ?
				done(null, user) :
				done(null, false, {message: 'Unauthorized'});
		})
	});
}));

// Login Required middleware.

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  api.unauthorized(req, res);
};

exports.isRestAuthenticated = passport.authenticate('basic', {session: true});

// Authorization Required middleware.

exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};