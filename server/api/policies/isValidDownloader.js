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
    if(!req.session.authenticated) {
        return res.send(401, 'Unauthorized');
    }
    else {
        return next();
    }
};
