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
    }

};

