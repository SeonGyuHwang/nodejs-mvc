var router = express.Router();
var params = {};

const title = '사용자인증';

router.get('/login', function (req, res, next) {

	if( req.session.userInfo ) {
		res.redirect('/freight');
		return;
	}

	params = req.body || {};
	params.title = title+' 로그인';
	params.addClass = ['is_pop', 'is_login'];

	var redirect = req.query.redirect || '/';
	if( redirect != '/' && user_redirect == '/' )
		user_redirect = redirect;


	res.render('auth/login', params);

});

router.get('/logout', function (req, res, next) {
	delete req.session.userInfo;

	res.redirect('/');
});

module.exports = router;
