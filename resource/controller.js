module.exports = function(fs) {

	app.all(/.*/, function(req, res, next){
		if( global.DOMAIN === null )
			global.DOMAIN = req.get('host');

        global.resultArr = {
            'status': 500
            ,'msg': '잘못된 접근입니다.'
            ,'url': ''
            ,'arr': {}
            ,'html': ''
            ,'close': 'off'
            ,'reload': 'off'
            ,'openerUrl': ''
            ,'openerReload': 'off'
            ,'dataReload': 'off'
            ,'openerDataReload': 'off'
            ,'recordsTotal': 0
            ,'recordsFiltered': 0
        };

		var parseUrl = url.parse(req.originalUrl, true, true);
		var uriArr = parseUrl.pathname.split('/');

		var uriExistsValues = uriArr.filter(function(n){
			return ['auth', 'apis'].includes(n);
		});

		if( !req.session.userInfo
			&& uriExistsValues.length <= 0 ) {

			res.redirect('/auth/login');

		} else {

			next();

		}

	});


	fs.readdirSync(ROUTES).forEach(function(target){

	    if( fs.statSync(ROUTES+'/'+target).isDirectory() ) {

            fs.readdirSync(ROUTES+'/'+target).forEach(function(subTarget){

                var pathName = subTarget.split('.')[0] || '';
                var setPath = '/'+target+'/'+pathName;

                app.use(setPath, require(ROUTES+'/'+target+'/'+subTarget));

            });

        } else {

            var pathName = target.split('.')[0] || '';
            var setPath = '/'+( pathName == 'index' ? '' : pathName );

            app.use(setPath, require(ROUTES+'/'+target));

        }

    });

	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		res.status(404);
		res.render('errors/404', {'title': '404 Not Found', 'addClass': ['is_pop', 'is_login']});
	});

	// error handler
	app.use(function (err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('errors/500', {'title': '페이지 에러', 'addClass': ['is_pop', 'is_login'], 'err_msg': res.locals.message});
	});

    /*var index = require(ROUTES+'/index');
    app.use('/', index);

    var login = require(ROUTES+'/login');
    app.use('/login', login);*/
};



