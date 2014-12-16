var crypto = require('crypto');

/**
 * Service for generation and handling authentication tokens.
 */
module.exports = {

    /**
     * Generates a new unique token for authentication.
     * @param {Function} cb         [Callback: token]
     */
    generateToken: function(cb) {

        // generate random bytes
        crypto.randomBytes(48, function(ex, buf) {
            // convert to string
            var token = buf.toString('hex');

            return cb(token);
        });
    },

    /**
     * Checks if a token has expired by its creation date.
     * @param  {date}    creationDate [Creation datetime of the token]
     * @return {Boolean}              [True: Token valid]
     */
    hasExpired: function(creationDate) {
        var now = new Date();
        return (now - creationDate) > 7;
    }
};