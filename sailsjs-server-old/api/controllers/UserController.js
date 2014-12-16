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
                return res.send(401, 'Invalid credentials');
            }

            // credentials were correct, create new session and save all needed data in the session & database
            AuthService.generateToken(function(newToken) {

                User.update({id: user.id}, {authToken: newToken, authCreated: new Date()}).exec(function(err, users) {

                    req.session.userId = users[0].id;
                    req.session.authToken = users[0].authToken;

                    return res.send({
                        msg: 'Login successfull',
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

                        // save important values in the session
                        req.session.userId = user.id;
                        req.session.authToken = user.authToken;

                        // everything went well, send response
                        return res.send({
                            msg: 'Account created',
                            token: user.authToken
                        });
                    });

                });

            }
        });
    },

    /**
     * [POST]  Checks if the user has a running session
     */
    session: function(req, res) {

        console.log(req.headers);

        if(!req.session.userId) {
            return res.send(401, 'No valid session open');
        }

        return res.send('Valid session open');
    }

};

