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

      console.log(file[0]);

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
    return res.json({
      todo: 'start() is not implemented yet!'
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

