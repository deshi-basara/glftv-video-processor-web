/**
 * Debug profiles
 * @type {Array}
 */
var profiles = [
    {
        name: 'Webm - 720p',
        codec_a: 'libvorbis',
        ac: 2,
        ar: 44100,
        b_a: '360k',
        codec_v: 'libvpx',
        quality: 'good',
        cpuused: 0,
        qmin: 10,
        qmax: 42,
        vf: 'scale=-1:720',
        threads: 4,
        output: 'webm'
    },
    {
        name: 'Ogv - 720p',
        codec_a: 'libvorbis',
        ac: 2,
        ar: 44100,
        b_a: '360k',
        codec_v: 'libtheora',
        qscale_v: 8,
        threads: 4,
        output: 'ogv'
    },
    {
        name: 'mp4 (h264) - 720p',
        codec_a: 'libfaac',
        ac: 2,
        ar: 44100,
        b_a: '360k',
        codec_v: 'libx264',
        b_v: '2000k',
        bufsize: '4000k',
        threads: 4,
        output: 'mp4'
    }

];




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
    // check if the request is valid
    if(!req.body.id || !req.body.profile) {
      return res.send(400, 'Bad request');
    }

    // check if the handed id belongs to a video
    var videoId = req.body.id;
    Videos.find({
      where: {id: videoId}
    }).exec(function(err, video) {
      if(err) return res.send(500, err);

      // does the video exist?
      if(!video) {
        return res.send(404, 'Video does not exist');
      }

      // does the profile exist?
      // @todo
      var debugProfile = profiles[0];

      // add the video to the queue
      KueService.transcodeVideo(video, debugProfile);
      
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

