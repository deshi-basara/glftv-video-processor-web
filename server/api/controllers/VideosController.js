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
   * `VideosController.create()`
   */
  create: function (req, res) {
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
   * `VideosController.start()`
   */
  start: function (req, res) {

    console.log(req.body);

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

        console.log(profile);

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

