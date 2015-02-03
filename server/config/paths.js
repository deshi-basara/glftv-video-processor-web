var path = require('path');

module.exports = {

    path: {
        transcoding: path.resolve(__dirname + '/../.tmp/transcodes'),
        finished: path.resolve(__dirname + '/../videos')
    }

};