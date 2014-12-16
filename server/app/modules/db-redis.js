var Waterline = require('waterline');
var redisAdapter = require('sails-redis');
var _ = require('underscore');
var orm = new Waterline();

/**
 * Define models to load here.
 */
var models = ['user'];

exports.initialize = function( app ){
	return function(fn){

		// Load the Models into the ORM
		models.forEach(function(name){
			orm.loadCollection(require('../models/' + name + '.js'));
		})

		// config
		app.config.waterline.adapters = { 'redis': redisAdapter };
		orm.initialize(app.config.waterline, function(err, models) {
			if(err) return fn(err);
			app.models = models.collections;
  			fn();
		});
	};
};