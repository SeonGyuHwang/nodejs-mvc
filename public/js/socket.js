(function($) {
    "use strict";

	var io_url, userInfo = {};

    window.onunload = function(){
    	if( socket )
    		socket.disconnect();
    };

    var setSocket = function(){
		io_url = $('script').filter(function(){
			return /socket\.io/.test($(this).attr('src'))
		}).attr('src');

		var hostname = $('<a>').prop('href', io_url).prop('hostname');
		var port = $('<a>').prop('href', io_url).prop('port');
		io_url = '//'+hostname+':'+(port || 80);

		window.socket = io.connect(io_url, { 'forceNew': true });

        socket.on('connect', function () {

			socket.emit('setUser', {
				'url': location.href
			});

        });

		socket.on('redirect', function(data){
			try {
				window.close();
			} catch(e) {}

			top.location.replace(data.redirect);
		});

		socket.on('getUser', function(data){
			userInfo = data;
		});

		socket.on('loginResult', function(data){
			if( data.msg )
				alert(data.msg);

			if( data.status == '200' )
				location.replace(data.redirect);

		});

        socket.on('room_notice', function(data){
            $('.nowChat').append('<li><span style="color:green;">[Notice]</span> '+data.msg+'</li>');

			$('.chatWrap').scrollTop($(".nowChat")[0].scrollHeight);
        });

        socket.on('user_list', function(data){
            $('.joinUser').empty();
            $.each(data.users, function(user_id, user_name){
                $('.joinUser').append('<option value="'+ user_id +'">'+ user_name +'</option>');
            });
        });

        socket.on('chat_history', function(data){

            var historyChat = '';
            $.each(data, function(row_key, row){
                var isMy = row['notice_yn'] == 'N' && row['sender'] == joinInfo.userId ? true : false;

				var historyChat = '<li class="text-'+( isMy ? 'right' : 'left' )+'" data-group="'+ row.group_id +'">';

                    if( row['notice_yn'] == 'Y' ) {
                        historyChat += '<span style="color:green;">[Notice]</span> ';
                    } else if( !isMy ) {
                        historyChat += '<span style="color:black;">['+ row.sender.userNm +']</span> : ';
                    }

                    historyChat += row.send_text;
                historyChat += '</li>';

				$('.nowChat').prepend(historyChat);
            });


            $('.chatWrap').scrollTop($(".nowChat")[0].scrollHeight);
        });

        socket.on('send_text', function(data){
            var addChat = '', isMy = data.sender.userId == joinInfo.userId ? true : false;

			addChat += '<li class="text-'+( isMy ? 'right' : 'left' )+'" data-group="'+ data.group_id +'">';

                if( data.notice_yn == 'Y' ) {
					addChat += '<span style="color:green;">[Notice]</span> ';
                } else if( !isMy ) {
					addChat += '<span style="color:black;">['+ data.sender.userNm +']</span> : ';
                }

			    addChat += data.send_text;
			addChat += '</li>';

            $('.nowChat').append(addChat);

            $('.chatWrap').scrollTop($(".nowChat")[0].scrollHeight);
        });

    };

    var _init = function(){
        setSocket();
	};

    $(function() {
        _init();

    });

})( jQuery );