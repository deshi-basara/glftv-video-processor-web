var kue = require('kue');
var jobs = kue.createQueue();

/**
 * Kue job for transcoding videos into a specified format.
 * @param  {[Object]}   job  [Kue-job-object]
 * @param  {Function}   done [Callback, that tells kue when the job is finshed]
 */
jobs.process('transcode', function(job, done) {
    // prepare the encoding
    job.log('Prepare transcode of ' + job.data.desc);
});

module.exports = {

    /**
     * Function for adding a new "transcode"-job to kue.
     * @param  {Object}   videoObj [Waterline object with the database representation of the video]
     * @param  {Object}   profile  [Encoding profile object of the output format]
     */
    transcodeVideo: function(videoObj, profileObj) {
        // create a kue job
        jobs.create('transcode', {
            desc: videoObj.name + '[' + profileObj.name + ']',
            video: videoObj,
            profile: profileData
        }).priority('normal').save();
    }

};