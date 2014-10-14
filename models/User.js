var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var _ = require('lodash');

var userSchema = new mongoose.Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  tokens: Array,

  profile: {
    name: {
      title: {type: String, default: ''},
      first: {type: String, default: ''},
      last: {type: String, default: ''}
    },
    location: {
      street: {type: String, default: ''},
      city: {type: String, default: ''},
      state: {type: String, default: ''},
      zip: {type: String, default: ''}
    },
    gender: {type: String, default: ''},
    picture: {
      large: {type: String, default: ''},
      medium: {type: String, default: ''},
      thumbnail: {type: String, default: ''}
    }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.virtual('profile.name.full').get(function() {
  return this.profile.name.first + ' ' + this.profile.name.last;
});

/**
 * Validate user's password.
 * Used by Passport-Local Strategy for password validation.
 */

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Get URL to a user's gravatar.
 * Used in Navbar and Account Management page.
 */

userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;

  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }

  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};

userSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

userSchema.set('toJSON', {
  transform: function(doc, user, options) {
    return _.omit(user, ['password', 'tokens']);
  }
});

module.exports = mongoose.model('User', userSchema);
