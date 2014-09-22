var _ = require('lodash');

module.exports = _.partialRight(_.assign, function(value, other) {
	return _.assign(value, other);
});
