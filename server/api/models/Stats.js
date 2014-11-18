/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

    connection: 'redis',

    attributes: {

        status: {
            type: 'string',
            required: true,
            defaultsTo: 'queued'
        },

        priority: {
            type: 'string',
            required: true
        },

        name: {
            type: 'string',
            required: true
        },

        twoPass: {
            type: 'boolean',
            required: true
        },

        profil: {
            type: 'string',
            required: true
        },

        progress: {
            type: 'float',
            required: true,
            defaultsTo: 0
        },

        createdBy: {
            type: 'string',
            required: true
        },

        startedAt: {
            type: 'datetime'
        }

    }

};

