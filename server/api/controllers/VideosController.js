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
   * Gets a file-upload and creates for the completly uploaded file a
   * video-model. Returns the id of the video-model.
   */
  upload: function (req, res) {
    // set the upload timeout to 'infinite'
    res.setTimeout(0);

    // streams the videoFile to the default upload directory '.tmp/uploads/'
    // on the server's local disk.
    req.file('videoFile').upload(uploadConfig, function(err, file) {
      if(err) return res.send(500, err);

      // create a new Video-Object
      Videos.create({
        name: file[0].filename,
        path: file[0].fd,
        user: 'Ada Rhode'
      }).exec(function(err, created) {
        if(err) return res.send(500, err);

        // everything went well, send response
        return res.json({
          msg: file[0].filename + ' uploaded successfully',
          id: created.id
        });
      });
    })
  },

  /**
   * Creates a video-model on the server for files that aren't uploaded,
   * but already exist on the server. Returns the id of the video-model.
   */
  model: function(req, res) {

    console.log(req.body);

    // check if the request is valid
    if(!req.body.name || !req.body.path) {
      return res.send(400, 'Bad request');
    }

    // create a new Video-Object
    Videos.create({
      name: req.body.name,
      path: req.body.path,
      user: 'Ada Rhode'
    }).exec(function(err, created) {
      if(err) return res.send(500, err);

      // everything went well, send response
      return res.json({
        msg: req.body.name + ' created successfully',
        id: created.id
      });
    });
  },

  /**
   * Searches all video files in the handed path and returns the found ones.
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
   * Adds an already uploaded or existing file to the transcoding queue, if
   * all dependencies resolve.
   */
  start: function (req, res) {

    // check if the request is valid
    if(!req.body.id || !req.body.profile) {
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

      // does the profile exist?
      Profiles.findOne({name: req.body.profile}, function(err, profile) {
        if(err) {
          return res.send(500, err);
        }
        else if(!profile) {
          return res.send(404, 'Profile does not exist');
        }

        // add the video to the queue
        KueService.transcodeVideo(video, profile, function(err) {
          if(err) {
            return res.send(500, err);
          }

          // everything went well, send response
          return res.send('Video was added to the queue');

        });
      })
    });
  },


  /**
   * `VideosController.edit()`
   */
  edit: function (req, res) {
    return res.json({
      todo: 'edit() is not implemented yet!'
    });
  },


  /**
   * `VideosController.delete()`
   */
  delete: function (req, res) {
    return res.json({
      todo: 'delete() is not implemented yet!'
    });
  },


  /**
   * `VideosController.all()`
   */
  all: function (req, res) {
    return res.json({
      todo: 'all() is not implemented yet!'
    });
  }
};

