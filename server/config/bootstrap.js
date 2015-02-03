var async = require('async');

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

    async.series([
        // settings
        function(cb) {
            createSettings(function(err) {
                cb(err);
            });
        },
        // profiles
        function(cb) {
            createProfiles(function(err) {
                cb(err);
            });
        }
    ], function(err) {

        // It's very important to trigger this callback method when you are finished
        // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
        cb();

    });
};

/**
 * Creates all default porfiles if needed.
 * @param  {Function} cb [Callback]
 */
function createProfiles(cb) {

    // create all needed profile db-entries in series
    async.series([
        function(cb) {
            // ogv settings
            Profiles.findOrCreate({
                name: 'webm 720p (2 Passes)'
            }, {
                name: 'webm 720p (2 Passes)',
                outputFormat: 'webm',
                scaleFactor: 'scale=-1:720',
                videoCodec: 'libvpx',
                twoPass: true,
                autor: 'Default',
                autorId: 999999,
                createdAt: "2015-02-02T18:50:51.898Z",
                updatedAt: "2015-02-02T18:50:51.898Z",
                json: "{\"codec:v\":\"libvpx\",\"quality\":\"good\",\"qmin\":\"10\",\"qmax\":\"42\",\"cpu-used\":\"0\",\"threads\":\"4\",\"codec:a\":\"libvorbis\",\"ac\":\"2\",\"ar\":\"44100\",\"b:a\":\"360k\"}"
            }).exec(function(err) {
                cb(err);
            });
        },
        function(cb) {
            // mp4 settings
            Profiles.findOrCreate({
                name: 'mp4 720p (2 Passes)'
            }, {
                name: 'mp4 720p (2 Passes)',
                outputFormat: 'mp4',
                scaleFactor: 'scale=-1:720',
                videoCodec: 'libx264',
                twoPass: true,
                autor: 'Default',
                autorId: 999999,
                createdAt: "2015-02-02T18:50:51.898Z",
                updatedAt: "2015-02-02T18:50:51.898Z",
                json: "{\"codec:v\":\"libx264\",\"pix_fmt\":\"yuv420p\",\"profile:v\":\"baseline\",\"preset\":\"slower\",\"crf\":\"18\",\"b:v\":\"1000k\",\"maxrate\":\"1000k\",\"bufsize\":\"2000k\",\"threads\":\"4\",\"codec:a\":\"libvorbis\",\"ac\":\"2\",\"ar\":\"44100\",\"b:a\":\"360k\"}"
            }).exec(function(err) {
                cb(err);
            });
        },
        function(cb) {
            // webm settings
            Profiles.findOrCreate({
                name: 'ogv 720p (2 Passes)'
            }, {
                name: 'ogv 720p (2 Passes)',
                outputFormat: 'ogv',
                scaleFactor: 'scale=-1:720',
                videoCodec: 'libtheora',
                twoPass: true,
                autor: 'Default',
                autorId: 999999,
                createdAt: "2015-02-02T18:50:51.898Z",
                updatedAt: "2015-02-02T18:50:51.898Z",
                json:  "{\"codec:v\":\"libtheora\",\"b:v\":\"1000k\",\"maxrate\":\"1000k\",\"bufsize\":\"2000k\",\"threads\":\"4\",\"codec:a\":\"libvorbis\",\"ac\":\"2\",\"ar\":\"44100\",\"b:a\":\"360k\"}"
            }).exec(function(err) {
                cb(err);
            });
        }
    ], function(err) {
        cb(err);
    });
}

/**
 * Creates all default settings if needed.
 * @param  {Function} cb [Callback]
 */
function createSettings(cb) {

    // create all needed settings db-entries in series
    async.series([
        function(cb) {
            // ogv settings
            Settings.findOrCreate({
                name: 'ogv'
            }, {
                name: 'ogv',
                modifiedBy: 'Default',
                createdAt: "2015-02-02T18:50:51.898Z",
                updatedAt: "2015-02-02T18:50:51.898Z",
                json: "{\"name\":\"ogv\",\"video\":[{\"key\":\"codec:v\",\"type\":\"text\",\"label\":\"Video-Codec\",\"placeholder\":\"libtheora\"},{\"key\":\"b:v\",\"type\":\"text\",\"label\":\"Video Bitrate\",\"placeholder\":\"1000k\"},{\"key\":\"maxrate\",\"type\":\"text\",\"label\":\"Max Bitrate\",\"placeholder\":\"1000k\"},{\"key\":\"bufsize\",\"type\":\"text\",\"label\":\"Bitrate Buffer\",\"placeholder\":\"2000k\"},{\"key\":\"threads\",\"type\":\"text\",\"label\":\"Threads\",\"placeholder\":4}],\"audio\":[{\"key\":\"codec:a\",\"type\":\"text\",\"label\":\"Audio-Codec\",\"placeholder\":\"libvorbis\"},{\"key\":\"ac\",\"type\":\"text\",\"label\":\"Audio-Kan&#228;le\",\"placeholder\":2},{\"key\":\"ar\",\"type\":\"text\",\"label\":\"Abtastrate\",\"placeholder\":44100},{\"key\":\"b:a\",\"type\":\"text\",\"label\":\"Bitrate\",\"placeholder\":\"360k\"}]}"
            }).exec(function(err) {
                cb(err);
            });
        },
        function(cb) {
            // mp4 settings
            Settings.findOrCreate({
                name: 'mp4'
            }, {
                name: 'mp4',
                modifiedBy: 'Default',
                createdAt: "2015-02-02T18:50:51.898Z",
                updatedAt: "2015-02-02T18:50:51.898Z",
                json: "{\"name\":\"mp4\",\"video\":[{\"key\":\"codec:v\",\"type\":\"text\",\"label\":\"Video-Codec\",\"placeholder\":\"libx264\"},{\"key\":\"pix_fmt\",\"type\":\"text\",\"label\":\"Pixel-Format\",\"placeholder\":\"yuv420p\"},{\"key\":\"profile:v\",\"type\":\"text\",\"label\":\"x264-Profile\",\"placeholder\":\"baseline\"},{\"key\":\"preset\",\"type\":\"text\",\"label\":\"Encoding-Geschwindigkeit\",\"placeholder\":\"slower\"},{\"key\":\"crf\",\"type\":\"text\",\"label\":\"Constant Rate Factor\",\"placeholder\":18},{\"key\":\"b:v\",\"type\":\"text\",\"label\":\"Video Bitrate\",\"placeholder\":\"1000k\"},{\"key\":\"maxrate\",\"type\":\"text\",\"label\":\"Max Bitrate\",\"placeholder\":\"1000k\"},{\"key\":\"bufsize\",\"type\":\"text\",\"label\":\"Bitrate Buffer\",\"placeholder\":\"2000k\"},{\"key\":\"threads\",\"type\":\"text\",\"label\":\"Threads\",\"placeholder\":4}],\"audio\":[{\"key\":\"codec:a\",\"type\":\"text\",\"label\":\"Audio-Codec\",\"placeholder\":\"libvorbis\"},{\"key\":\"ac\",\"type\":\"text\",\"label\":\"Audio-Kan&#228;le\",\"placeholder\":2},{\"key\":\"ar\",\"type\":\"text\",\"label\":\"Abtastrate\",\"placeholder\":44100},{\"key\":\"b:a\",\"type\":\"text\",\"label\":\"Bitrate\",\"placeholder\":\"360k\"}]}"
            }).exec(function(err) {
                cb(err);
            });
        },
        function(cb) {
            // webm settings
            Settings.findOrCreate({
                name: 'webm'
            }, {
                name: 'webm',
                modifiedBy: 'Default',
                createdAt: "2015-02-02T18:50:51.898Z",
                updatedAt: "2015-02-02T18:50:51.898Z",
                json:  "{\"name\":\"webm\",\"video\":[{\"key\":\"codec:v\",\"type\":\"text\",\"label\":\"Video-Codec\",\"placeholder\":\"libvpx\"},{\"key\":\"quality\",\"type\":\"select\",\"label\":\"Qualit&#228;t\",\"options\":[{\"name\":\"good (empfohlen)\",\"value\":\"good\"},{\"name\":\"best\",\"value\":\"best\"},{\"name\":\"realtime\",\"value\":\"realtime\"}]},{\"key\":\"qmin\",\"type\":\"text\",\"label\":\"Quantisierungs-Min\",\"placeholder\":10},{\"key\":\"qmax\",\"type\":\"text\",\"label\":\"Quantisierungs-Max\",\"placeholder\":42},{\"key\":\"cpu-used\",\"type\":\"text\",\"label\":\"CPU-Used\",\"placeholder\":0},{\"key\":\"threads\",\"type\":\"text\",\"label\":\"Threads\",\"placeholder\":4}],\"audio\":[{\"key\":\"codec:a\",\"type\":\"text\",\"label\":\"Audio-Codec\",\"placeholder\":\"libvorbis\"},{\"key\":\"ac\",\"type\":\"text\",\"label\":\"Audio-Kan&#228;le\",\"placeholder\":2},{\"key\":\"ar\",\"type\":\"text\",\"label\":\"Abtastrate\",\"placeholder\":44100},{\"key\":\"b:a\",\"type\":\"text\",\"label\":\"Bitrate\",\"placeholder\":\"360k\"}]}"
            }).exec(function(err) {
                cb(err);
            });
        }
    ], function(err) {
        cb(err);
    });
}