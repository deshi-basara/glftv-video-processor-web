

module.exports = {

    all: function() {

    },

    /**
     * Creates a new stats-object in the database.
     * @param  {string}    statsName     [The name of the stats object, normally the videoObj.name]
     * @param  {string}    statsPriority [KueService priority]
     * @param  {boolean}   statsPass     [True === 2-pass encoding enabled]
     * @param  {string}    statsProfil   [Transcoding-profile name]
     * @param  {string}    statsCreator  [The person who started the transcoding task]
     * @param  {Function}  cb            [Callback, returns: Error, statsId]
     */
    create: function(statsName, statsPriority, statsPass, statsProfil, statsCreator, cb) {

        // create a new Stats-Object
        Stats.create({
            name: statsName,
            priority: statsPriority,
            twoPass: statsPass,
            profil: statsProfil,
            createdBy: statsCreator
        }).exec(function(err, stat) {
            if(err) return cb(err);

            // everything went well
            return cb(null, stat.id);
        });
    },

    /**
     * Updates the Stats-Object specified by the statsId.
     * @param  {int}    statsId [Database-id of the stats-entry]
     * @param  {object} values  [Key/Value-object with all data we want to update]
     */
    update: function(statsId, values) {

        // update the Stats-Object identified by its id
        Stats.update({id: statsId}, values).exec(function(err, updated) {
            if(updated) {
                // send an update message to all connected sockets
                sails.io.sockets.emit('stats.progress.update', updated[0]);
            }
        });
    }

};