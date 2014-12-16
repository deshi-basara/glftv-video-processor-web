var http = require('http');
var fs = require('fs');
var co = require('co');
var cookieHelper = require('../helpers/cookieHelper');
var _ = require('underscore');

/**
 * Expose the socket Api
 */
var socket = Risotto.socket = {};

/**
 *
 */
var io; 


/**
 * holds the visible room list
 *
 */
 var rooms = {1:{}};
 var roomInfos = {}

/**
 * Init
 * @param {app} app
 * @param {Function} done
 */
exports.initialize = function( app ){
    return function(fn) {

    	// create an own http server for our socket
    	var socketServer = http.createServer();

    	// initiate the socket
		io = Risotto.socket.io = require('socket.io').listen(socketServer);

		// start listeing for connections on the port
		socketServer.listen(Risotto.config.socket.port);

		Risotto.logger.log("Socket listening :" + Risotto.config.socket.port);

    	// register all socket events
    	socket.registerEvents();

		fn();
    };
};

/**
 * Register all important socket events.
 */

socket.registerEvents = function() {
	io.on('connection', function(client) {
		getUser(client, function(err, user){
			if(err){
				client.emit('authError', 'Not authorized');
				return Risotto.logger.warn('Non authorized user connected to socket');
			}
			Risotto.logger.info('[Socket] ' + user.username + ' connected');
			bindClient(client, user);
		});
	});
};

/**
 * getActiveUserForRoom
 *
 */
socket.getActiveUserForRoom = function(room){
	if(!(room in rooms)){
		console.log("noot")
		return []
	}

	return Object.keys(rooms[room]);
};


/**
 * sendAnnotationToRoom 
 */
socket.sendAnnotationToRoom = function(room, annotation){
	io.to(room).emit('room:annotation', annotation);
};

/**
 * Bind user events
 */
function bindClient(client, user){
	/**
	 * room:open
	 * @param {String} room
	 */

	client.on('room:open', function(roomId){
		Risotto.models.room.findOne({id: roomId}, function(err, room){
			if(!room.owner === user.user_id){
				Risotto.logger.warn('[Socket] tries to open room without ownership');
				return;
			}

			room.visible = true;
			room.save();
			rooms[roomId] = {};
			roomInfos[roomId] = room.toJSON();
		});
	});

	/**
	 * room:join 
	 * @param {String} room
	 */
	client.on('room:join', function(room){
		if(room in rooms){
			rooms[room][user.username] = user.id;
			client.join(room);
			io.to(room).emit('room:join', user.id);
			Risotto.logger.info('[Socket] '+ user.username +' joined room:' + room);
		} else {
			Risotto.logger.warn('[Socket] '+ user.username +' tried to join non-active room:' + room);
		}
	});

	/**
	 * room:message
	 */
	client.on('room:message', function(msgText){
		var messageObj = {
			text: msgText,
			created_at: new Date(),
			from: user.id,
			name: user.username
		};

		io.to(last(client.rooms))
			.emit('room:message', messageObj);
	})

	/**
	 * room:leave
	 * for students
	 */
	client.on('room:leave', function(){
		var room = last(client.rooms);
		if(_.isString(room)){
			return Risotto.logger.warn('[Socket] Client tried to leave a room but was in no room!!');
		}
		client.leave(room)
		io.to(room).emit('room:leave', user.id);
		Risotto.logger.info('[Socket] '+ user.username +' left room:' + room);
	});

	/**
	 * room:close
	 * closes the room
	 * user has to owner of the room 
	 */
	client.on('room:close', function(){
		var roomId = last(client.rooms)

		Risotto.models.room.findOne({id: roomId}, function(err, room){
			if(!room.owner === user.user_id){
				Risotto.logger.warn('[Socket] tries to close room without ownership');
				return;
			}

			io.to(roomId).emit('room:close');
			//TODO: kick all clients from that room

			room.visible = false;
			room.save();
			
			delete rooms[roomId];
			delete roomInfos[roomId];
		});
	});

	client.on('room:info', function(roomId){
		// return name and id
		client.emit('room:info', rooms[roomId] || {})
	});

	client.on('pdf:profpage', function(page){
		var room = last(client.rooms);
		io.to(room).emit('pdf:profpage', page);
	});
};


function getUser(client, cb){
	var cookie =  cookieHelper.get(client, 'koa:sess');
	var signedCookie = cookieHelper.get(client, 'koa:sess', Risotto.config.http.session.secret);

	if(signedCookie){
		cookie = signedCookie;
	}

	if(!cookie){
		return cb(new Error('Not authorized'));
	}

	var session = JSON.parse(new Buffer(cookie, 'base64').toString('utf8'));

	Risotto.models.user.findOne({id: session.user_id}, cb);
}


function last(arr){
	return arr[arr.length-1];
}