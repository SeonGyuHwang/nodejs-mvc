var router = express.Router();
var params = {};

router.get('/naver/login', function (req, res, next) {
	params = req.body || {};
	params.addClass = ['is_pop', 'is_login'];
	params.title = '네이버 아이디로 로그인';

	res.render('apis/naver/login', params);

});

router.get('/google/login', function (req, res, next) {
	var params = req.body;
	params.addClass = ['is_pop', 'is_login'];
	params.title = '구글 아이디로 로그인';

	res.render('apis/google/login', params);

});

module.exports = router;
