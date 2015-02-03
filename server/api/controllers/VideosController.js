var async = require('async');
var path = require('path');

/**
 * Upload settings
 * @type {Object}
 */
var uploadConfig = {
  maxBytes: 10000000000 // 10gb
};

/**
 * VideosController
 *
 * @description :: Server-side logic for managing Videos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
module.exports = {

  /**
   * [GET] Download request for a transcoded video.
   */
  download: function(req, res) {

    // check if the request is valid
    if(!req.params.statsId) {
      return res.send(400, 'Bad request');
    }

    //@todo check for download rights

    // does the stats entry exist?
    Stats.findOne({id: req.params.statsId}).exec(function(err, stat) {
      if(err) return res.send(500, err);

      // is there a stats entry?
      if(stat) {
        var downloadPath = path.resolve(stat.path);

        res.download(downloadPath);
      }
      else {
        res.send(400, 'Bad request');
      }
    });
  },

  /**
   * [POST] Gets a file-upload and creates for the completly uploaded file a
   *        video-model. Returns the id of the video-model.
   */
  upload: function (req, res) {

    // set the upload timeout to 'infinite'
    res.setTimeout(0);

    // streams the videoFile to the default upload directory '.tmp/uploads/'
    // on the server's local disk.
    req.file('videoFile').upload(uploadConfig, function(err, file) {
      if(err) return res.send(500, err);

      // check if the user exists
      User.findOne({id: req.body.id}).exec(function(err, user) {
        if(err || !user) {
          return res.send(500, err);
        }

        // create a new Video-Object
        Videos.create({
          name: file[0].filename,
          path: file[0].fd,
          user: user.name,
          uploaded: 1
        }).exec(function(err, created) {
          if(err) return res.send(500, err);

          // everything went well, send response
          return res.json({
            msg: file[0].filename + ' uploaded successfully',
            id: created.id
          });
        });

      });
    });
  },

  /**
   * [POST] Creates a video-model on the server for files that aren't uploaded,
   *        but already exist on the server. Returns the id of the video-model.
   */
  model: function(req, res) {

    // check if the request is valid
    if(!req.body.name || !req.body.path) {
      return res.send(400, 'Bad request');
    }

    // get the autor of the model
    User.findOne({id: req.headers.user}).exec(function(err, user) {
      if(err) return res.send(500, err);

      // create a new Video-Object
      Videos.create({
        name: req.body.name,
        path: req.body.path,
        user: user.name
      }).exec(function(err, created) {
        if(err) return res.send(500, err);

        // everything went well, send response
        return res.json({
          msg: req.body.name + ' created successfully',
          id: created.id
        });
      });
    });
  },

  /**
   * [POST] Searches all video files in the handed path and returns the found ones.
   */
  search: function(req, res) {

    // check if the request is valid
    if(!req.body.path) {
      return res.send(400, 'Bad request');
    }

    SearchService.searchInPath(req.body.path, function(err, results) {
      if(err) {
        return res.send(500, err);
      }

      // return the search result
      return res.send(results);
    });
  },

  /**
   * [POST] Adds an already uploaded or existing file to the transcoding queue, if
   *        all dependencies resolve.
   */
  start: function (req, res) {

    // check if the request is valid
    if(!req.body.id || !req.body.profiles || req.body.profiles.length === 0) {
      return res.send(400, 'Bad request');
    }

    // check if the handed id belongs to a video
    var videoId = req.body.id;
    Videos.findOne({
      id: videoId
    }).exec(function(err, video) {
      if(err) return res.send(500, err);

      // does the video exist?
      if(!video) {
        return res.send(404, 'Video does not exist');
      }

      // do the handed profiles exist?
      var profileArray = [];
      async.eachSeries(req.body.profiles, function(profileName, cb) {
        // try to get the current profile from the database
        Profiles.findOne({name: profileName}, function(err, profile) {
          if(err) return cb(err);

          // if the profile-result is empty, the profile does not exist
          if(!profile) {
            cb('Profile does not exist');
          }
          else {
            // add the current profile data to the profileArray
            profileArray.push(profile);
            cb();
          }
        });
      }, function(err) {
        // checking was finished in series, react on errors and proceed
        if(err) {
          return res.send(404, 'Profile does not exist');
        }

        // video and profiles exist, add the video to the queue
        KueService.transcodeVideo(video, profileArray, function(err) {
          if(err) {
            return res.send(500, err);
          }

          // everything went well, send response
          return res.send('Video was added to the queue');

        });
      });
    });
  }
};

