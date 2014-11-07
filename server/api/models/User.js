var bcrypt = require('bcrypt');


/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    connection: 'redis',

    attributes: {

        name: {
            type: 'string',
            required: true
        },

        email: {
            type: 'email',
            required: true
        },

        password: {
            type: 'string',
            required: false
        },

        activated: {
            type: 'integer',
            defaultsTo: 0
        },

        role: {
            type: 'integer',
            defaultsTo: 0
        },

        comparePassword: function(password){
            // if the passwords match, return true
            return bcrypt.compareSync(password, this.password);
        }

    },

    // Lifecycle Callbacks
    beforeCreate: function(values, next) {
        console.log(values);
        bcrypt.hash(values.password, 10, function(err, hash) {
            if(err) return next(err);

            values.password = hash;
            next();
        });
    }

};

