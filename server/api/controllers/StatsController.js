/**
 * StatsController
 *
 * @description :: Server-side logic for managing stats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

    /**
     * [GET]  Gets all stats-entries in the database
     */
    all: function(req, res) {

        //@todo check auth

        /*if(req.body.page === undefined) {
            return res.send(400, 'Bad request');
        }

        // sort descending, limit to 20 enties, skip for pagination
        Stats.find().sort({ createdAt: 'desc' }).skip(req.body.page * 15).limit(15).exec(function(err, stats) {
            if(err) {
                return res.send(500, err);
            }

            res.send(stats);
        });*/

        Stats.find().sort({ createdAt: 'desc' }).exec(function(err, stats) {
            if(err) {
                return res.send(500, err);
            }

            res.send(stats);
        });
    },

    /**
     * [DELETE]  Cancels a job identified by the handed id.
     */
    cancel: function(req, res) {

        console.log(req.body.id);

        // check if the request is valid
        if(!req.body.id) {
            return res.send(400, 'Bad request');
        }

        // does the stats-entry exist?
        Stats.findOne({id: req.body.id}).exec(function(err, stat) {
            if(err) {
                return res.send(500, err);
            }

            if(!stat) {
                return res.send(404, 'Stat entry does not exist');
            }

            // remove the stats entry
            Stats.destroy({id: req.body.id}).exec(function(err) {
                if(err) {
                    return res.send(500, err);
                }

                // remove the job from the kue-queue
                KueService.removeJob(stat.kueId, function(err) {
                    if(err) {
                        return res.send(500, err);
                    }

                    // everything went well, return feedback
                    return res.send('Job was canceled');
                });
            });
        });
    },

    /**
     * [DELETE] Removes all stats-entries identified by req.body.removeIds
     */
    remove: function(req, res) {

        // check if the request is valid
        if(!req.body.removeIds) {
            return res.send(400, 'Bad request');
        }

        // remove all entries (1 destroy with multiple ids doesn't work!)
        var removeLength = req.body.removeIds.length;
        for (var i = 0; i < removeLength; i++) {
            Stats.destroy({id: req.body.removeIds[i]}).exec(function(err) {
                if(err) {
                    return res.send(500, err);
                }
            }); //@ŧodo fix potential race condition

            if(i === (removeLength-1)) {
                // if index === length, there are no other ids left to be detroyed
                return res.send('Finished videos were removed');
            }
        }
    }

};

