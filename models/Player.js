var mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;

var playerSchema = new mongoose.Schema({
	name: String,
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
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

playerSchema.statics.getByUser = function(userId, cb) {
	this.find({user: userId}).exec(cb);
};

module.exports = mongoose.model('Player', playerSchema);