var process = require('child_process');
var shellescape = require('shell-escape');
var _ = require('underscore');

/**
 * Trims and splits the last stderr-Line, which holds all the
 * processing data. Returns an object with all needed values
 * from the last line in key/value-form.
 * @param  {string} stderrString [Stderr-output form child_process.exec]
 * @return {object}              [All needed values stderr in key/value-form]
 */
function getProcessingData(stderrString) {
    // get the last line
    var lastLine = stderrString.split(/\r\n|\r|\n/g);

    // get the processing Data from the lastLine
    var processingData = lastLine[lastLine.length - 2];

    // if there is processingData, get all values
    if(processingData) {

        // trim processingData and get an array from it
        var trimmed = processingData.replace(/=\s+/g, '=').trim();
        var values = trimmed.split(' ');

        // get all key, values from the array
        var processingObj = {};
        for (var i = 0; i < values.length; i++) {
            // get the current key=value pair
            var currentPair = values[i];

            // split it and get a seperate key, value
            var splittedPair = currentPair.split('=', 2);
            var key = splittedPair[0];
            var value = splittedPair[1];

            // only insert real processing data
            if(value) {
                processingObj[key] = value;
            }
        };

        return processingObj;
    }
}

/**
 * Converts the FFmpeg time-indicator into seconds.
 * @param  {string} ffmpegTime [Time value, e.g. 00:00:09.21]
 * @return {int}               [Time value in seconds]
 */
function FFmpegTimeToSeconds(ffmpegTime) {
    if(!ffmpegTime) return 0;

    var parts = ffmpegTime.split(':');
    var secs = 0;

    // add hours
    secs += parseInt(parts[0], 10) * 3600;
    // add minutes
    secs += parseInt(parts[1], 10) * 60;

    // split sec/msec part
    var secParts = parts[2].split('.');

    // add seconds
    secs += parseInt(secParts[0], 10);

    return secs;
}

/**
 * Calculates from the current progress from time.
 * @param  {int} ffmpegTimeSecs [Time processed so far]
 * @param  {int} videoTotalTime [Total time to process]
 * @return {float}              [Current progress with two decimals]
 */
function calcProgress(ffmpegTimeSecs, videoTotalTime) {
    return ((ffmpegTimeSecs / videoTotalTime) * 100).toFixed(2);
}


/**
 * FFmpegService.js
 *
 * FFmpeg service for converting uploaded files.
 */
module.exports = {

    /**
     * Executes the given cmd-line prefixes for ffmpeg.
     * @param  {String}   cmd        [FFmpeg shell command]
     * @param  {String}   folderName [Folder name of the video file for cwd]
     * @param  {Function} cbProgress [Progress-Callback: current transcoding progress as float]
     * @param  {Function} cb         [Callback: err]
     */
    convert: function(cmd, folderName, cbProgress, cb) {
        var videoTotalTime = null;

        // execute the ffmpeg transcoding command
        var transcodeProcess = process.exec('ffmpeg ' + cmd, {cwd: folderName}, function(error, stdout, stderr) {
            if(error) {
                return cb(error);
            }
        });

        // 'stderr' outputs the ffmpeg progress
        transcodeProcess.stderr.on('data', function(data) {
            // if there is no total video-time set, fetch the data before we calculate the progress
            if(videoTotalTime === null) {
                // get all Duration-Strings from 'stderr'
                var durationArray = /Duration: (([0-9]+):([0-9]{2}):([0-9]{2}).([0-9]+))/.exec(data);

                // the video-duration appears not before the fourth 'stderr'-event, that's why we have
                // to check if the durationArray is filled
                if(durationArray) {
                    // get the total duration as ffmpeg-timecode
                    var ffmpegDuration = durationArray[1];

                    // convert into seconds
                    videoTotalTime = FFmpegTimeToSeconds(ffmpegDuration);
                }
            }
            else {
                // get all needed data for calculating the progress
                var currentProcessingData = getProcessingData(data);
                var currentSecs = FFmpegTimeToSeconds(currentProcessingData.time);
                // calculate
                var currentProgress = calcProgress(currentSecs, videoTotalTime);

                cbProgress(currentProgress);
            }
        });

        // when the transcoding is finished
        transcodeProcess.on('exit', function(err) {
            cb(err);
        });
    },

    /**
     * Prepares the ffmpeg-cli-command and returns it
     * @param  {Object}   profile [Database representation of the video we want to convert]
     * @param  {Object}   profile [Database representation of the conversion-profile]
     * @param  {Function} cb      [Callback: err | cli-cmd 1-pass | cli-cmd 2-pass]
     */
    prepareCmd: function(video, profile, cb) {

        // command array, all cmd parameters are adde
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
            cmdPassTwo.push('-' + key); // example key prefix: -bitrate
            cmdPassTwo.push(value); // example key value: 1000k
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
        cmdPassTwo.push('-f', profile.outputFormat, video.transcodingDest + '/' +video.fileName +
                            '-' + profile.name.replace(' ', '_') + '.' +profile.outputFormat);

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