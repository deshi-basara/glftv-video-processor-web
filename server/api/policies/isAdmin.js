/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to check if a user is an admin.
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // check if the user exists
  User.findOne({id: req.headers.user}).exec(function(err, user) {
      if(err || !user || !user.authCreated) {
          return res.send(401, 'Unauthorized');
      }

      if(user.role === 1) {
          return next();
      }
      else {
          return res.send(401, 'Unauthorized');
      }
  });
};
