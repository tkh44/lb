/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var csrf = require('lusca').csrf();
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo')({ session: session });
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');

/**
 * Controllers (route handlers).
 */

var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');

/**
 * API keys and Passport configuration.
 */

var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */

var app = express();

/**
 * Connect to MongoDB.
 */

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * CSRF whitelist.
 */

var csrfExclude = ['/api/v1'];

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('json spaces', 2);
app.use(compress());
app.use(connectAssets({
  paths: [path.join(__dirname, 'public/css'), path.join(__dirname, 'public/js')],
  helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  // CSRF protection.
  if (_.contains(csrfExclude, req.path)|| ~req.path.search('/api/')) return next();
  csrf(req, res, next);
});
app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  var path = req.path.split('/')[1];
  if (/auth|login|logout|signup|fonts|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Main routes.
 */

app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


app.use('/api', passportConf.isRestAuthenticated);

app.route('/api/v1/users/me')
	.get(userController.me);
app.route('/api/v1/users')
	.get(userController.all)
	.post(userController.create);
app.route('/api/v1/users/:userId')
	.get(userController.get)
//	.put(userController.update)
// .delete(userController.destroy);

var leagueController = require('./controllers/league');

app.route('/api/v1/leagues')
	.get(leagueController.all)
	.post(leagueController.create);
app.route('/api/v1/leagues/:leagueId')
	.get(leagueController.get)
	.put(leagueController.update)
	.delete(leagueController.destroy);
app.route('/api/v1/leagues/:leagueId/teams/:leagueTeamId')
	.put(leagueController.addTeam)
	.delete(leagueController.destroyTeam);

var teamController = require('./controllers/team');

app.route('/api/v1/teams')
	.get(teamController.all)
  .post(teamController.create);
app.route('/api/v1/teams/:teamId')
  .get(teamController.get)
  .put(teamController.update)
  .delete(teamController.destroy);
app.route('/api/v1/teams/:teamId/players/:teamPlayerId')
  .put(teamController.addPlayer)
  .delete(teamController.destroyPlayer);

var playerController = require('./controllers/player');

app.route('/api/v1/players')
	.get(playerController.all)
  .post(playerController.create);
app.route('/api/v1/players/:playerId')
	.get(playerController.get)
  .put(playerController.update)
  .delete(playerController.destroy);

var gameController = require('./controllers/game');

app.route('/api/v1/games')
	.get(gameController.all)
	.post(gameController.create)
app.route('/api/v1/games/:gameId')
	.get(gameController.get)
	.put(gameController.update)
	.delete(gameController.destroy);
app.route('/api/v1/games/:gameId/teams/:teamId')
	.put(teamController.addTeam)
	.delete(teamController.destroyTeam);

app.param('leagueId', leagueController.league);
app.param('teamId', teamController.team);
app.param('playerId', playerController.player);


/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;