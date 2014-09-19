var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.Types.ObjectId,
	moment = require('moment');

var gameSchema = new mongoose.Schema({
	name: String,
	league: {
		type: Schema.ObjectId,
		ref: 'League'
	},
	teams: [{type: Schema.ObjectId, ref: 'Team'}],
	date: {
		type: Date,
		default: Date.now()
	},
	created: {
		type: Date,
		default: Date.now()
	},
	updated: {
		type: Date,
		default: Date.now()
	}
});

/**
 * Pre-save hook
 */
gameSchema.pre('save', function(next) {
	this.updated = new Date();
	if (!this.created) this.created = new Date();
	next();
});

gameSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('league teams').exec(cb);
};

gameSchema.statics.getByLeague = function(leagueId, cb) {
	this.find({league: leagueId}).exec(cb);
};

Game = mongoose.model('Game', gameSchema);

Game.schema.path('teams').validate(function(value) {
	return value.length <= 2;
}, 'Only 2 teams allowed');

module.exports = Game;