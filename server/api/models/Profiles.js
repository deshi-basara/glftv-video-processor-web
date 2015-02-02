/**
* Profiles.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    connection: 'redis',

    attributes: {

        name: {
            type: 'string',
            required: true,
            unique: true
        },

        outputFormat: {
            type: 'string',
            required: true
        },

        scaleFactor: {
            type: 'string',
            required: true
        },

        videoCodec: {
            type: 'string',
            required: true
        },

        twoPass: {
            type: 'boolean',
            required: true
        },

        autor: {
            type: 'string',
            required: true
        },

        json: {
            type: 'string',
            required: true
        }

    }
};

