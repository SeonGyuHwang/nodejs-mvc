var boardDao = {};


boardDao.getDataRow = function(args, callback){
	var tmpRow = [], params = [args._pk];

    return new Promise(function(resolve, reject) {

        if( !args._pk ) {

            if (typeof callback === "function")
                callback.apply(null, [tmpRow]);
            else
                resolve(tmpRow);

        } else {

            pool.getConnection(function(err, conn){
                var setQuery = 'SELECT ';
                    setQuery += ' 	* ';
                    setQuery += ' FROM board ';
                    setQuery += ' 	WHERE del_yn = "N" ';
                    setQuery += ' 		AND board_pk = ? ';

                conn.query(setQuery, params, function (err, rows) {
                    conn.release();
                    if(err) reject(err);

                    tmpRow = rows.shift() || {};

                    if( !Func.isEmpty(tmpRow) ) {
                        tmpRow['board_title_decode'] = Func.htmlspecialchars_decode(tmpRow['board_title']);
                        tmpRow['board_content_decode'] = Func.htmlspecialchars_decode(tmpRow['board_content']);

                        tmpRow['created_date_format'] = moment(tmpRow['created_date'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
                        tmpRow['updated_date_format'] = moment(tmpRow['updated_date'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
                    }

                    if (typeof callback === "function")
                        callback.apply(null, [tmpRow]);
                    else
                        resolve(tmpRow);


                });

            });

        }

    });

};

boardDao.getDataCount = function(args, callback){
	var tmpRow = [], params = [];

	return new Promise(function(resolve, reject) {

        pool.getConnection(function(err, conn){

            var setQuery = 'SELECT ';
                setQuery += ' 	COUNT(board_pk) AS cnt ';
                setQuery += ' FROM board ';
                setQuery += ' 	WHERE del_yn = "N" ';

            if( args.sch_start_date ) {
                setQuery += ' AND DATE_FORMAT(created_date, "%Y-%m-%d") >= ? ';
                params.push( args.sch_start_date );
            }

            if( args.sch_end_date ) {
                setQuery += ' AND DATE_FORMAT(created_date, "%Y-%m-%d") <= ? ';
                params.push( args.sch_end_date );
            }

            if( args.sch_writer_id ) {
                setQuery += ' AND writer_id LIKE CONCAT("%", ?, "%") ';
                params.push( args.sch_writer_id );
            }

            if( args.sch_writer_nickname ) {
                setQuery += ' AND writer_nickname LIKE CONCAT("%", ?, "%") ';
                params.push( args.sch_writer_nickname );
            }

            conn.query(setQuery, params, function (err, rows) {
                conn.release();
                if(err) reject(err);

                tmpRow = rows.shift() || {};

                var totalCount = parseInt(tmpRow.cnt) || 0;

                if (typeof callback === "function")
                    callback.apply(null, [totalCount]);
                else
                    resolve(totalCount);

            });

        });
    });


};

boardDao.getDataList = function(args, callback){
	var tmpRow = [], params = [];

    return new Promise(function(resolve, reject) {

        pool.getConnection(function(err, conn){
            var setQuery = 'SELECT ';
                setQuery += ' 	* ';
                setQuery += ' FROM board ';
                setQuery += ' 	WHERE del_yn = "N" ';

            if( args.sch_start_date ) {
                setQuery += ' AND DATE_FORMAT(created_date, "%Y-%m-%d") >= ? ';
                params.push( args.sch_start_date );
            }

            if( args.sch_end_date ) {
                setQuery += ' AND DATE_FORMAT(created_date, "%Y-%m-%d") <= ? ';
                params.push( args.sch_end_date );
            }

            if( args.sch_writer_id ) {
                setQuery += ' AND writer_id LIKE CONCAT("%", ?, "%") ';
                params.push( args.sch_writer_id );
            }

            if( args.sch_writer_nickname ) {
                setQuery += ' AND writer_nickname LIKE CONCAT("%", ?, "%") ';
                params.push( args.sch_writer_nickname );
            }

            setQuery += ' 	ORDER BY board_pk DESC ';

            if( args.start && args.length ) {
                setQuery += ' LIMIT ?, ? ';

                params.push( parseInt(args.start) || 0 );
                params.push( parseInt(args.length) || 25 );
            }

            conn.query(setQuery, params, function (err, rows) {
                conn.release();
                if(err) reject(err);

                rows.forEach(function(row){

                    row['created_date_format'] = moment(row['created_date'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
                    row['created_datetime'] = moment(row['created_date'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                    row['updated_date_format'] = moment(row['updated_date'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
                    row['updated_datetime'] = moment(row['updated_date'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

                    tmpRow.push(row);

                });

                if (typeof callback === "function")
                    callback.apply(null, [tmpRow]);
                else
                    resolve(tmpRow);

            });

        });

    });

};

boardDao.insertData = function (params) {
	var add_params = params || {};

	if( add_params.board_title )
	    add_params.board_title = Func.htmlspecialchars(add_params.board_title);
	if( add_params.board_content )
	    add_params.board_content = Func.htmlspecialchars(add_params.board_content);

	if( typeof add_params === 'object' ) {

		pool.getConnection(function(err, conn){
			conn.query('INSERT INTO `board` SET ?', add_params, function (err, rows) {
				conn.release();
				if(err) throw err;

				//var insert_id = rows.insertId;
			});
		});

	}
};

boardDao.updateData = function(idx, params){
	var add_params = params || {};

	if( typeof add_params === 'object' ) {

        if( add_params.board_title )
            add_params.board_title = Func.htmlspecialchars(add_params.board_title);
        if( add_params.board_content )
            add_params.board_content = Func.htmlspecialchars(add_params.board_content);

		var setQuery = ' UPDATE `board` SET ';
			setQuery += ' 	? ';
			setQuery += ' WHERE board_pk = ? ';

		pool.getConnection(function(err, conn){
			conn.query(setQuery, [add_params, idx], function (err, rows) {
				conn.release();
				if(err) throw err;
			});
		});

	}

};

module.exports = boardDao;