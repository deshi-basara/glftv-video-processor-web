var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var kue = require('kue');
var mv = require('mv');
var path = require('path');

// create the queue
var jobs = kue.createQueue();
// create the json-api
//var api = kue.app.listen(1338);

/**
 * Kue job for transcoding videos into a specified format.
 * @param  {[Object]}   job  [Kue-job-object]
 * @param  {Function}   done [Callback, that tells kue when the job is finshed]
 */
jobs.process('transcode', function(job, done) {
    setTimeout(function() {

        // prepare the encoding
        StatsService.update(job.data.statsId, {status: 'started', startedAt: new Date()});

        // does the specified video file exist?
        fs.exists(job.data.video.path, function(exists) {
            if(!exists) {
                console.log('Aborting transcode of ' + job.data.desc + ': ' + job.data.video.path + ' does not exist');
                return done('Video file does not exist');
            }

            // copy the video file to its transcoding-folder
            // @todo don't copy, just use the file.
            fse.copy(job.data.video.path, job.data.video.transcodingDest + '/' + job.data.video.fileName +
                job.data.video.fileExtension, function(err) {
                if(err) return done('Coud not move the video to the transcoding folder: '+ job.data.video.transcodingDest);

                // transcoding workflow
                async.series([
                    // pass-1 function
                    function(next) {

                        // do we have a 2-pass transcoding?
                        if(job.data.passOne !== null) {
                            FFmpegService.convert(job.data.passOne, job.data.video.transcodingDest, function(progress) {
                                // is called, whenever a new progress was calculated

                                // we have a 2-pass encoding, change the progress to max 50%
                                progress = (progress / 2).toFixed(0);
                                StatsService.update(job.data.statsId, {progress: progress});

                            }, function(err) {
                                if(err) return done(err);

                                // 1-pass finished, start 2-pass
                                next();
                            });
                        }
                        else {
                            // no 2-pass encoding, go directly to the next function
                            next();
                        }
                    },
                    // pass-2 function
                    function(next) {

                        FFmpegService.convert(job.data.passTwo, job.data.video.transcodingDest, function(progress) {
                            // is called, whenever a new progress was calculated

                            // if we have a 2-pass encoding, let the 2-pass start at min 50%
                            if(job.data.passOne !== null && progress > 0.00) {
                                progress = (50 + (progress / 2)).toFixed(0);
                            }
                            else {
                                //progress = 100.00;
                            }
                            StatsService.update(job.data.statsId, {progress: progress});

                        }, function(err) {
                            if(err) return done(err);

                            StatsService.update(job.data.statsId, {progress: 100.00});

                            // 2-pass finished, start cleaning
                            next();
                        });
                    }
                ], function(error, result) {
                    if(err) return done(err);

                    // remove the copied video file
                    fs.unlink(job.data.video.transcodingDest + '/' + job.data.video.fileName +
                        job.data.video.fileExtension, function(err) {
                        if(err) return done(err);

                        // job was finished
                        done();
                    });

                });

            });
        });

    }, 5000);
});

/**
 * Kue job for unlinking uploaded videos.
 * @param  {[Object]}   job  [Kue-job-object]
 * @param  {Function}   done [Callback, that tells kue when the job is finshed]
 */
jobs.process('unlink', 0, function(job, done) {
    setTimeout(function() {
        console.log(job.data);

        // does the specified video file exist?
        fs.exists(job.data.file, function(exists) {
            if(!exists) {
                console.log('Aborting unlinking of ' + job.data.file + ': does not exist');
                return done('Uploaded file does not exist');
            }

            fs.unlink(job.data.file, function(err) {
                if(err) return done(err);

                console.log('File ' + job.data.file + 'was unlinked');

                // job was finished
                done();
            });
        });

    }, 5000);
});


/**
 * Listens for Queue-lebel events.
 * @param  {[type]} id     [description]
 * @param  {[type]} result [description]
 * @return {[type]}        [description]
 */
/*jobs.on('job failed', function(id, result) {
    console.log(id);
    console.log(result);
    kue.Job.get(id, function(err, job) {
        if (err) return;

        job.remove(function(err) {
            if (err) throw err;
            console.log('removed completed job #%d', job.id);
        });
    });
});*/


module.exports = {

    /**
     * Function for adding a new "transcode"-job to kue.
     * @param  {Object}   videoObj      [Waterline object with the database representation of the video]
     * @param  {Array}    profileArray  [All waterline objects with the representations of the profiles we want the video
     *                                   to transcode to]
     * @param  {Function} cb            [Callback, returns err]
     */
    transcodeVideo: function(videoObj, profileArray, cb) {

        // get the transcoding destination
        videoObj.fileExtension = '.' + videoObj.path.substr(videoObj.path.lastIndexOf('.') + 1);
        videoObj.fileName = path.basename(videoObj.path, videoObj.fileExtension);
        videoObj.transcodingDest = sails.config.path.transcoding + '/' + videoObj.fileName;

        // foreach profile entry, generate needed data & create a new kue-job
        async.eachSeries(profileArray, function(profileObj, cb) {

            // create the transcoding command
            FFmpegService.prepareCmd(videoObj, profileObj, function(err, passOne, passTwo, transcodedPath) {
                if(err) {
                    return cb(err);
                }

                // create a new stats model
                StatsService.create(videoObj.name, videoObj.priority, profileObj.twoPass, profileObj.name, videoObj.user, transcodedPath,
                    function(err, statsId) {
                        if(err) {
                            return cb(err);
                        }

                        // create a kue job
                        var job = jobs.create('transcode', {
                            desc: videoObj.name + ' [' + profileObj.name + ']',
                            video: videoObj,
                            profile: profileObj,
                            passOne: passOne,
                            passTwo: passTwo,
                            statsId: statsId
                        }).priority(videoObj.priority).removeOnComplete(true).save(function() {
                            // after creation, save the kue-job-id into the stats-object
                            // (for later kue-job handling).
                            StatsService.update(statsId, {kueId: job.id});
                        });

                        // potential job events
                        job.on('complete', function() {
                            // set status to finished
                            StatsService.update(statsId, {status: 'finished'});
                        }).on('failed', function(error) {
                            console.log(error);
                            StatsService.update(statsId, {status: 'failed'});
                        });

                        // everything went well, call series-async-callback
                        cb();
                    }
                );
            });

        }, function(err) {
            // check if the video file was uploaded
            if(videoObj.uploaded == 1) {

                setTimeout(function() {
                    // create an additional remove job for unlinking the uploaded file
                    var unlink = jobs.create('unlink', {
                        file: videoObj.path
                    }).priority('medium').removeOnComplete(false).save();

                }, 10000);
            }

            // jobs were added successfully, call callback for triggering the response feedback
            return cb();
        });
    },

    /**
     * Removes a job identified by its id from the queue-
     * @param  {int}      jobId [id of the job we want to cancel]
     * @param  {function} cb    [callback]
     */
    removeJob: function(jobId, cb) {

        kue.Job.get(jobId, function(err, job) {
            if(err) return cb(err);

            // remove the job
            job.remove();

            return cb();
        });
    },

    /**
     * Restart all active jobs.
     * Recovery from server crashes and unexpected behavior.
     */
    restartJobs: function(){
        kue.Job.rangeByState('active', 0, 500, 'desc', function(err, active){
            if(err) return console.log(err);

            active.forEach(function(job){
                job.inactive();
                console.log('Job ' + job.id + ' readded to Queue!');
            });
        });
    }
};