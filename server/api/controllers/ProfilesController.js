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
        if(!req.body.name) {
            return res.send(400, 'Bad request');
        }

        // remove the entry
        Profiles.destroy({name: req.body.name}).exec(function(err) {
            if(err) {
                return res.send(500, err);
            }

            res.send('Profile removed');
        });
    },

    /**
     * [POST] Saves a handed profile into the database.
     */
    save: function(req, res) {

        // check if the request is valid
        if(!req.body.profile || !req.body.profile.name || !req.body.profile.outputFormat ||
                !req.body.profile['codec:v'] || (req.body.profile.twoPass === undefined)) {
            return res.send(400, 'Bad request');
        }

        // get all needed database data and remove it from the json object.
        // Save the jsonObj as string.
        try {
            var name = req.body.profile.name;
            var outputFormat = req.body.profile.outputFormat;
            var scaleFactor = req.body.profile.vf;
            var videoCodec = req.body.profile['codec:v'];
            var twoPass = req.body.profile.twoPass;

            delete req.body.profile['name'];
            delete req.body.profile['outputFormat'];
            delete req.body.profile['twoPass'];

            var jsonString = JSON.stringify(req.body.profile);
        } catch(e) {
            return res.send(500, e);
        }

        // get the autor of the profile
        User.findOne({id: req.headers.user}).exec(function(err, user) {
            if(err) return res.send(500, err);

            //@todo maybe check for overwrites

            // save the profile object
            Profiles.create({
                name: name,
                outputFormat: outputFormat,
                scaleFactor: scaleFactor,
                videoCodec: videoCodec,
                twoPass: twoPass,
                autor: user.name,
                json: jsonString
            }).exec(function(err, profile) {
                if(err) return res.send(500, err);

                // everything went well, send response
                return res.send('Profile was created');
            });

        });
    }
};

