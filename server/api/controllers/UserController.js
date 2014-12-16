/**
 * Checks if the submited email is a hs-furtwangen.de email.
 * @param  {[String]}  mail [Submitted mail]
 * @return {Boolean}        [True if valid]
 */
function isHsMail(mail){
    return /(.+)\.(.+)\@hs\-furtwangen\.de/.test(String(mail));
}

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

    /**
     * [POST]  Gets login credentials and registers a session or declines the
     *         credentials.
     */
    login: function(req, res) {

        // check if the request is valid
        if(!req.body.mail || !req.body.pass){
            return res.send(400, 'Missing required form data');
        }

        // try to get the user from the database and compare the passwords
        User.findOne({'email': req.body.mail}).exec(function(err, user) {
            if(err) {
                return res.send(500, err);
            }
            else if(!user || (user.comparePassword(req.body.pass) === false)) {
                return res.send(400, 'Invalid credentials');
            }

            // credentials were correct, create new session and save all needed data in the session & database
            AuthService.generateToken(function(newToken) {

                User.update({id: user.id}, {authToken: newToken, authCreated: new Date()}).exec(function(err, users) {

                    return res.send({
                        msg: 'Login successfull',
                        id: users[0].id,
                        name: users[0].name,
                        role: users[0].role,
                        token: users[0].authToken
                    });

                });
            });
        });
    },

    /**
     * [POST]  Trys to register a new user.
     */
    register: function(req, res) {

        // check if the request is valid
        if(!req.body.mail || !req.body.name || !req.body.pass){
            return res.send(400, 'Missing required form data');
        }

        // check if the email is a valid hs-furtwangen email
        if(!isHsMail(req.body.mail)) {
            return res.send(403, 'Not a valid hs-furtwangen mail');
        }

        // check if user is already registered
        User.findOne({'email': req.body.mail}).exec(function(err, user) {

            if(err) {
                return res.send(500, err);
            }
            else if(user) {
                return res.send(409, 'User does already exist');
            }
            else {

                // generate an authToken for the user
                AuthService.generateToken(function(token) {

                    // create user in the database
                    User.create({
                        name: req.body.name,
                        email: req.body.mail,
                        password: req.body.pass,
                        authToken: token,
                        authCreated: new Date()
                    }).exec(function(err, user) {
                        if(err) {
                            return res.send(500, err);
                        }

                        // everything went well, send response
                        return res.send({
                            msg: 'Account created',
                            id: user.id,
                            name: user.name,
                            role: user.role,
                            token: user.authToken
                        });
                    });

                });

            }
        });
    },

    /**
     * [GET]  Checks if the user has a valid authentication
     */
    auth: function(req, res) {

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
                return res.send('Authorized');
            }
            else {
                return res.send(401, 'Unauthorized');
            }
        });
    }
};

