var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
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
playerSchema.pre('save', function(next) {
	this.updated = new Date();
	if (!this.created) this.created = new Date();
	next();
});

playerSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};


module.exports = mongoose.model('Player', playerSchema);