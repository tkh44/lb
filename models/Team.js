var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
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
teamSchema.pre('save', function(next) {
	this.updated = new Date();
	if (!this.created) this.created = new Date();
	next();
});

teamSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};


module.exports = mongoose.model('Team', teamSchema);