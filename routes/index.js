var router = express.Router();

router.get('/', function (req, res, next) {

	res.redirect('/board');

});

module.exports = router;
