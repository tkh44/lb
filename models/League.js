var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId,
  moment = require('moment');

var leagueSchema = new mongoose.Schema({
  name: String,
  manager: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  teams: [{type: Schema.ObjectId, ref: 'Team'}],
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
  }).populate('manager teams').exec(cb);
};

leagueSchema.statics.getByManager = function(userId, cb) {
  this.find({manager: userId}).exec(cb);
};


module.exports = mongoose.model('League', leagueSchema);