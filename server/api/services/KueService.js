var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var kue = require('kue');
var mv = require('mv');
var path = require('path');

// create the queue
var jobs = kue.createQueue();
// create the json-api
var api = kue.app.listen(1338);

/**
 * Kue job for transcoding videos into a specified format.
 * @param  {[Object]}   job  [Kue-job-object]
 * @param  {Function}   done [Callback, that tells kue when the job is finshed]
 */
jobs.process('transcode', function(job, done) {
    // prepare the encoding
    console.log('Prepare transcode of ' + job.data.desc);

    // does the specified video file exist?
    fs.exists(job.data.video.path, function(exists) {
        if(!exists) {
            console.log('Aborting transcode of ' + job.data.desc + ': ' + job.data.video.path + ' does not exist');
            return done('Video file does not exist');
        }

        // copy the video file to its transcoding-folder
        fse.copy(job.data.video.path, job.data.video.transcodingDest + '/' + job.data.video.fileName +
            job.data.video.fileExtension, function(err) {
            if(err) return done('Coud not move the video to the transcoding folder: '+ folderName);

            // file was copied, start the transcoding
            console.log('Starting transcode of ' + job.data.desc);

            // transcoding workflow
            async.series([
                // pass-1 function
                function(next) {

                    // do we have a 2-pass transcoding?
                    if(job.data.passOne !== null) {
                        console.log('1-Pass: ' + job.data.desc);
                        FFmpegService.convert(job.data.passOne, job.data.video.transcodingDest, function(err) {
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

                    console.log('2-Pass: ' + job.data.desc);
                    FFmpegService.convert(job.data.passTwo, job.data.video.transcodingDest, function(err) {
                        if(err) return done(err);

                        // 2-pass finished, start cleaning
                        next();
                    });
                }
            ], function(error, result) {
                if(err) return done(err);

                console.log('removing');

                done();
            });

        });
    });
});

module.exports = {

    /**
     * Function for adding a new "transcode"-job to kue.
     * @param  {Object}   videoObj [Waterline object with the database representation of the video]
     * @param  {Object}   profile  [Encoding profile object of the output format]
     * @param  {Function} cb       [Callback, returns err]
     */
    transcodeVideo: function(videoObj, profileObj, cb) {

        // get the transcoding destination
        videoObj.fileExtension = '.' + videoObj.path.substr(videoObj.path.lastIndexOf('.') + 1);
        videoObj.fileName = path.basename(videoObj.path, videoObj.fileExtension);
        videoObj.transcodingDest = sails.config.path.transcoding + '/' + videoObj.fileName;

        console.log(profileObj);
        console.log(videoObj);

        // create the transcoding command
        FFmpegService.prepareCmd(videoObj, profileObj, function(err, passOne, passTwo) {
            if(err) {
                return cb(err);
            }

            // create a new stats model
            StatsService.create(videoObj.name, videoObj.priority, profileObj.twoPass, profileObj.name, 'Ada Rhode', function(err) {
                if(err) {
                    return cb(err);
                }

                // create a kue job
                jobs.create('transcode', {
                    desc: videoObj.name + ' [' + profileObj.name + ']',
                    video: videoObj,
                    profile: profileObj,
                    passOne: passOne,
                    passTwo: passTwo
                }).priority(videoObj.priority).save();

            });
        })
    }

};