/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user.
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    // check if the request is valid
    if(!req.headers.authorization || !req.headers.user) {
        return res.send(401, 'Unauthorized');
    }

    // check if the user exists
    User.findOne({id: req.headers.user}).exec(function(err, user) {
        if(err || !user || !user.authCreated) {
            return res.send(401, 'Unauthorized');
        }

        // compate the handed with the send token & check if the token is still valid
        var tokenMatches = user.compareTokens(req.headers.authorization);
        var hasNotExpired = AuthService.hasExpired(user.authCreated);
        if(tokenMatches && hasNotExpired) {
            // create a session (e.g. for GET-downloads)
            req.session.authenticated = true;
            return next();
        }
        else {
            return res.send(401, 'Unauthorized');
        }
    });

};
