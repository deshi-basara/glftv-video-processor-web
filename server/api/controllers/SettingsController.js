/**
 * SettingsController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * [GET] Fetches all settings from the db and returns them.
     */
    all: function(req, res) {

        // get all settings
        Settings.find().exec(function(err, settings) {
            if(err) return res.send(500, err);

            // everything went well, send response
            return res.send(settings);
        });

    },

    /**
     * [DELETE] Deletes a setting entry from the db, identified by it's name.
     */
    remove: function(req, res) {

        // check if the request is valid
        if(!req.body.name) {
            return res.send(400, 'Bad request');
        }

        // remove the entry
        Settings.destroy({name: req.body.name}).exec(function(err) {
            if(err) {
                return res.send(500, err);
            }

            res.send('Setting removed');
        });
    },

    /**
     * [POST] Trys to save new settings into the database.
     */
    save: function(req, res) {

        // check if the request is valid
        if(!req.body.name || !req.body.settings) {
            return res.send(400, 'Bad request');
        }

        // Save the jsonObj as string.
        try {
            var jsonString = JSON.stringify(req.body.settings);
        } catch(e) {
            return res.send(500, e);
        }

        // check if the setting-name does already exists
        Settings.findOne({name: req.body.name}).exec(function(err, settings) {
            if(err) {
                return res.send(500, err);
            }
            else if(settings) {
                // settings exist, warn the user
                res.send(405, 'Settings already exist');
            }

            // save the settings object
            Settings.create({
                name: req.body.name,
                json: jsonString,
                modifiedBy: 'Ada Rhode',
            }).exec(function(err, settings) {
                if(err) return res.send(500, err);

                // everything went well, send response
                return res.send('Settings were created');
            });
        });
    }

};

