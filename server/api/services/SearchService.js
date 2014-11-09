var fs = require('fs');
var path = require('path');
var readdirp = require('readdirp');

var videoFilter = ['*.webm', '*.ogv', '*.mp4', '*.mkv', '*.flv', '*.avi', '*.wmv', '*.mpg'];

/**
 * Service for searching files in the filesystem.
 * Also handles search rights.
 */
module.exports = {

    /**
     * Searches recursively all videos in the handed path.
     * @param {String}   searchPath [Path in which we want to search]
     * @param {Function} cb         [Callback: error | results]
     */
    searchInPath: function(searchPath, cb) {
        console.log('searchPath: '+searchPath);

        // check if the path exists
        fs.exists(searchPath, function(exists){
            if(!exists) return cb('SearchPath does not exist');

            // read all files that match the video pattern
            var searchResult = [];
            var fileStream = readdirp({
                root: searchPath,
                fileFilter: videoFilter
            }).on('data', function(entry) {
                console.log(searchResult.length);
                // an entry was found, push related meta-data to the searchResult-Array
                searchResult.push({
                    name: entry.name,
                    path: entry.fullPath
                });
            }).on('end', function() {
                // hand all search results back
                cb(null, searchResult);
            });
        });
    }
};