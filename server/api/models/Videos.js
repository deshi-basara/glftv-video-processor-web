/**
* Videos.js
*
* @description :: Video model representation of a video that was uploaded and waiting to be converted
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    connection: 'redis',

    attributes: {

        status : {
            type: 'string',
            required: true,
            defaultsTo: 'uploading'
        },

        priority : {
            type: 'string',
            required: true,
            defaultsTo: 'medium'
        },

        name : {
            type: 'string',
            required: true
        },

        profil : {
            type: 'int',
            required: true,
            defaultsTo: 0
        },

        two_pass : {
            type: 'int',
            required: true,
            defaultsTo: 0
        },

        user : { 
            type: 'int',
            required: true
        },

        paused : { 
            type: 'int',
            required: true,
            defaultsTo: 0
        }
    }
};

