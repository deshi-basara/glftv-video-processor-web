var _ = require('underscore');

// array for filtering illegal cmd words
var illegalWords = ['scaleFactor', 'videoCodec', 'autor', 'autorId', 'json', 'createdAt', 'updatedAt', 'id', '&&']

/**
 * ProfilesController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

    /**
     * [GET] Fetches all available profiles from the database and returns them.
     */
    all: function(req, res) {
        Profiles.find().exec(function(err, profiles) {
            if(err) return res.send(500, err);

            // everything went well, send response
            return res.send(profiles);
        });
    },

    /**
     * [DELETE] Deletes a profile entry from the db, identified by it's name.
     */
    remove: function(req, res) {

        // check if the request is valid
        if(!req.body.id) {
            return res.send(400, 'Bad request');
        }

        // does the profile exist we want to remove
        Profiles.findOne({id: req.body.id}).exec(function(err, profile) {
            if(err) return res.send(500, err);

            // get the user profile data
            User.findOne({id: req.headers.user}).exec(function(err, user) {
                if(err) return res.send(500, err);

                // has the user the right to remove the profile, because its his own
                // or he is a global admin?
                if(user.id === profile.autorId || user.role === 1) {

                    Profiles.destroy({id: req.body.id}).exec(function(err) {
                        if(err) {
                            return res.send(500, err);
                        }

                        res.send('Profile removed');
                    });

                }
                else {
                    return res.send(500, 'No permissions to remove the profile!')
                }
            });
        });
    },

    /**
     * [POST] Saves a handed profile into the database.
     */
    save: function(req, res) {

        // check if the request is valid
        if(!req.body.profile || !req.body.profile.name || !req.body.profile.outputFormat ||
                !req.body.profile['codec:v'] || !req.body.profile.vf || (req.body.profile.twoPass === undefined)) {
            return res.send(400, 'Bad request');
        }

        // remove illegal cmd-values
        var filteredRequest = _.omit(req.body.profile, illegalWords);

        // get all needed database data and remove it from the json object.
        // Save the jsonObj as string.
        try {
            var name = filteredRequest.name;
            var outputFormat = filteredRequest.outputFormat;
            var scaleFactor = filteredRequest.vf;
            var videoCodec = filteredRequest['codec:v'];
            var twoPass = filteredRequest.twoPass;

            delete filteredRequest['name'];
            delete filteredRequest['outputFormat'];
            delete filteredRequest['vf'];
            delete filteredRequest['twoPass'];

            var jsonString = JSON.stringify(filteredRequest);
        } catch(e) {
            return res.send(500, e);
        }

        // get the autor of the profile
        User.findOne({id: req.headers.user}).exec(function(err, user) {
            if(err) return res.send(500, err);

            // check for overwrites
            Profiles.findOne({name: name}).exec(function(err, profile) {
                if(err) return res.send(500, err);

                // we have an overwrite, update the existing profile
                if(profile) {

                    // has the user the right to update the profile?
                    if(user.id === profile.autorId || user.role === 1) {

                        // save the profile object
                        Profiles.update({name: name}, {
                            outputFormat: outputFormat,
                            scaleFactor: scaleFactor,
                            videoCodec: videoCodec,
                            twoPass: twoPass,
                            autor: user.name,
                            autorId: user.id,
                            json: jsonString
                        }).exec(function(err, profile) {
                            if(err) return res.send(500, err);

                            // everything went well, send response
                            return res.send('Profile was updated');
                        });
                    }
                    else {
                        // no rights to modify the profile
                        return res.send(401, 'You do not have permissions to modify this profile!');
                    }
                }
                // we have a new profile, create it
                else {

                    // save the profile object
                    Profiles.create({
                        name: name,
                        outputFormat: outputFormat,
                        scaleFactor: scaleFactor,
                        videoCodec: videoCodec,
                        twoPass: twoPass,
                        autor: user.name,
                        autorId: user.id,
                        json: jsonString
                    }).exec(function(err, profile) {
                        if(err) return res.send(500, err);

                        // everything went well, send response
                        return res.send('Profile was created');
                    });
                }
            })
        });
    }
};

