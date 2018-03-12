var router = express.Router();
var params = {};

const title = '샘플 게시판';

router.get('/', function (req, res, next) {
	params = req.body || {};
	params.title = title;

    params.sch_start_date = req.query.sch_start_date || '';
    params.sch_end_date = req.query.sch_end_date || '';

	res.render('board/index', params);
});

router.get('/view/:board_pk', function (req, res, next) {
	params = req.body || {};

	var pk = req.params.board_pk || null;

    boardService.getBoardRow({ '_pk': pk })
        .then(function(row){
            if( Func.isEmpty(row) ) {
                res.status(404);
                res.render('errors/404', {'title': '404 Not Found'});
            } else {

                boardDao.updateData(pk, { 'view_cnt': row.view_cnt+1 });

                params.title = row.board_title;

                params.row = row;
                params.isWrite = row.writer_id == req.session.userInfo.userId ? true : false;
                params.refer = '/board?start='+req.query.start || 0;
                res.render('board/view', params);
            }

        });

});

router.get('/write', function (req, res, next) {
	params = req.body || {};
	params.row = {};
	params.title = title+' 등록/수정';
	params.addClass = ['is_pop', 'is_login', 'is_popup_resize'];

	var pk = req.query.pk || null;

    boardService.getBoardRow({ '_pk': pk })
        .then(function(row){

            if( pk && Func.isEmpty(row) ) {

                res.status(404);
                res.render('errors/404', {'title': '404 Not Found'});

            } else if( pk && row.writer_id != req.session.userInfo.userId ) {

                res.status(403);
                res.render('errors/403', {'title': '403 Access Denied'});

            } else {

                params.row = row;
                res.render('board/popup/write', params);

            }

        });

});

router.get('/getDataList', function (req, res, next) {

    boardService.getBoardList(req.query)
        .then(function(data){

            res.render('board/ajax/list', params, function(err, viewHtml){
                resultArr.status = 200;
                resultArr.msg = '로드 성공';
                resultArr.html = viewHtml;
                resultArr.arr['list'] = data.list;

                resultArr.recordsTotal = data.count;
                resultArr.recordsFiltered = data.count;

                res.json(resultArr);
            });
        });

});

router.post('/saveData', function (req, res, next) {

	var _pk = req.body._pk || '';

	var board_title = req.body.board_title || '';
	var board_content = req.body.board_content || '';
	var writer_nickname = req.body.writer_nickname || req.session.userInfo.userId;

    boardService.getBoardRow({ '_pk': _pk })
        .then(function(row){

            if( !_pk ) {

                boardDao.insertData({
                    'board_title': board_title
                    ,'board_content': board_content
                    ,'writer_nickname': writer_nickname
                    ,'writer_id': req.session.userInfo.userId
                    ,'created_id': req.session.userInfo.userId
                    ,'created_date': moment().format('YYYY-MM-DD HH:mm:ss')
                });

                resultArr.status = 200;
                resultArr.msg = '처리 되었습니다.';
                resultArr.openerDataReload = 'on';
                resultArr.close = 'on';

            } else if( Func.isEmpty(row) ) {

                resultArr.status = 404;
                resultArr.msg = '404 Not Found';

            } else if( row.writer_id != req.session.userInfo.userId ) {

                resultArr.status = 403;
                resultArr.msg = '403 Access Denied';

            } else {

                boardDao.updateData(_pk, {
                    'board_title': board_title
                    ,'board_content': board_content
                    ,'writer_nickname': writer_nickname
                    ,'updated_id': req.session.userInfo.userId
                    ,'updated_date': moment().format('YYYY-MM-DD HH:mm:ss')
                });

                resultArr.status = 200;
                resultArr.msg = '수정 되었습니다.';
                resultArr.openerReload = 'on';
                resultArr.close = 'on';

            }

            res.json(resultArr);
        });


});

router.post('/deleteData', function (req, res, next) {

	var _pk = req.body.idx || '';

    boardService.getBoardRow({ '_pk': _pk })
        .then(function(row){

            if( Func.isEmpty(row) ) {

                resultArr.status = 404;
                resultArr.msg = '404 Not Found';

            } else if( row.writer_id != req.session.userInfo.userId ) {

                resultArr.status = 403;
                resultArr.msg = '403 Access Denied';

            } else {

                boardDao.updateData(_pk, {
                    'del_yn': 'Y'
                    ,'updated_id': req.session.userInfo.userId
                    ,'updated_date': moment().format('YYYY-MM-DD HH:mm:ss')
                });

                resultArr.status = 200;
                resultArr.msg = '삭제 되었습니다.';
                resultArr.close = 'on';
                resultArr.openerUrl = '/board';

            }

	        res.json(resultArr);
        });

});



module.exports = router;
