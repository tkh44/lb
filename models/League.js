var mongoose = require('mongoose');

var leagueSchema = new mongoose.Schema({
	name: String,
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
leagueSchema.pre('save', function(next) {
	this.updated = new Date();
	if (!this.created) this.created = new Date();
	next();
});

leagueSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};


module.exports = mongoose.model('League', leagueSchema);