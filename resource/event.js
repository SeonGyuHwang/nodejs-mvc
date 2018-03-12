module.exports = function() {

    io.on('connection', function (socket) {
 		socket.userInfo = {};
		//console.log(ip.address());

		socket.on('setUser', function(data){

			if( socket.handshake.session.userInfo ) {

				var args = socket.handshake.session.userInfo;
				args['id'] = socket.id;
				socket.userInfo = args;

				users[socket.userInfo.userId] = socket.userInfo;

			} else {

				var parseUrl = url.parse(data.url, true, true);
				var uriArr = parseUrl.pathname.split('/');
				var uriExistsValues = uriArr.filter(function(n){
					return ['auth', 'apis'].includes(n);
				});

				if( uriExistsValues.length <= 0 ) {

					io.sockets.to(socket.id).emit('redirect', {
						'redirect': '/auth/login?redirect='+parseUrl.pathname
					});

				}

			}

		});

		socket.on('userLogin', function(args){
			socket.handshake.session.userInfo = args;
			socket.handshake.session.save();

			args['id'] = socket.id;
			socket.userInfo = args;

			users[socket.userInfo.userId] = socket.userInfo;

			io.sockets.to(socket.id).emit('loginResult', {
				'status': '200'
				,'loginType': args.loginType
				,'redirect': global.user_redirect
			});
		});

		socket.on('disconnect', function () {
            delete users[socket.userInfo.userId];

            socket.disconnect(true);
        });
    });
};



