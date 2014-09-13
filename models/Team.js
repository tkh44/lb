var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	PlayerSchema  = require('./Player');

var teamSchema = new Schema({
	name: String,
	created: {
		type: Date,
		default: Date.now()
	},
	updated: {
		type: Date,
		default: Date.now()
	},
	manager: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	players: [
		{
			type: Schema.ObjectId,
			ref: 'Player'
		}
	]
});

/**
 * Pre-save hook
 */
teamSchema.pre('save', function(next) {
	this.updated = new Date();
	if (!this.created) this.created = new Date();
	next();
});

teamSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).populate('manager players').exec(cb);
};


module.exports = mongoose.model('Team', teamSchema);