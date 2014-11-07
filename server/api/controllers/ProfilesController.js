/**
 * ProfilesController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Fetches all available profiles from the database and returns them.
     * @return {[type]}     []
     */
    all: function(req, res) {
        // @todo check if the user has auth

        Profiles.find().exec(function(err, profiles) {
            if(err) return res.send(500, err);

            // everything went well, send response
            return res.send(profiles);
        });
    },

    /**
     * Saves a handed profile into the database.
     * @return {[Response]}     [Error or Success]
     */
    save: function(req, res) {
        // check if the request is valid
        if(!req.body.profile || !req.body.profile.profileName || !req.body.profile.outputFormat ||
                !req.body.profile['v:c']) {
            return res.send(400, 'Bad request');
        }

        // get all needed database data and remove it from the json object.
        // Save the jsonObj as string.
        try {
            var profileName = req.body.profile.profileName;
            var outputFormat = req.body.profile.outputFormat;
            var videoCodec = req.body.profile['v:c'];

            delete req.body.profile['profileName'];
            delete req.body.profile['outputFormat'];

            var jsonString = JSON.stringify(req.body.profile);
        } catch(e) {
            return res.send(500, e);
        }

        //@todo maybe check for overwrites

        // save the profile object
        Profiles.create({
            name: profileName,
            outputFormat: outputFormat,
            videoCodec: videoCodec,
            autor: 'Ada Rhode',
            json: jsonString
        }).exec(function(err, profile) {
            if(err) return res.send(500, err);

            // everything went well, send response
            return res.send('Profile was created');
        });
    }
};

