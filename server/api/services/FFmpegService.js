var process = require('child_process');
var shellescape = require('shell-escape');
var _ = require('underscore');


/**
 * FFmpegService.js
 *
 * FFmpeg service for converting uploaded files.
 */
module.exports = {

    /**
     * Executes the given cmd-line
     * @param  {String}   cmd        [FFmpeg shell command]
     * @param  {String}   folderName [Folder name of the video file for cwd]
     * @æparam {Function} cb         [Callback: err]
     */
    convert: function(cmd, folderName, cb) {
        // execute the ffmpeg command
        var transcodeProcess = process.exec('ffmpeg ' + cmd, {cwd: folderName}, function(error, stdout, stderr) {
            if(error) {
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);

                return cb(error);
            }
        });

        // when the transcoding is finished
        transcodeProcess.on('exit', function(code) {
            cb();
        });
    },

    /**
     * Prepares the ffmpeg-cli-command and returns it
     * @param  {Object}   profile [Database representation of the video we want to convert]
     * @param  {Object}   profile [Database representation of the conversion-profile]
     * @param  {Function} cb      [Callback: err | cli-cmd 1-pass | cli-cmd 2-pass]
     */
    prepareCmd: function(video, profile, cb) {

        // command array, all cmd parameters are added
        var cmdPassTwo = [];
        var cmdPassOne = null;

        // add the input file
        cmdPassTwo.push('-i', video.transcodingDest + '/' + video.fileName + video.fileExtension);

        // parse the json string into an object
        try {
            var paramsObj = JSON.parse(profile.json);
        } catch(err) {
            return cb('Parsing error');
        }

        // bring the json-object into array form
        _.each(paramsObj, function(value, key) {
            cmdPassTwo.push('-' + key); // key prefix: -bitrate
            cmdPassTwo.push(value); // key value: 1000k
        });

        // does the user want a 2-pass encoding?
        if(profile.twoPass) {
            // clone the array
            var cmdPassOne = _.clone(cmdPassTwo);

            // 1-pass and escape
            cmdPassOne.push('-pass', 1); // @todo set audio to disabled on 1-pass
            cmdPassOne.push('-f', profile.outputFormat, '-y', '/dev/null');
            cmdPassOne = shellescape(cmdPassOne);

            // 2-pass
            cmdPassTwo.push('-pass', 2);
        }

        // add the output file
        cmdPassTwo.push('-f', profile.outputFormat, video.transcodingDest + '/' +video.fileName + '.' +profile.outputFormat);

        // escape cmd
        cmdPassTwo = shellescape(cmdPassTwo);

        return cb(null, cmdPassOne, cmdPassTwo);
    }
};

/*setTimeout(function() {

Profiles.findOne({name: 'Simon 720p'}).exec(function(err, profileObj) {

    Videos.findOne({id: 22}).exec(function(err, videoObj) {

        KueService.transcodeVideo(videoObj, profileObj, function(err) {
            console.log(err);
        })
    });
});


}, 1000);*/