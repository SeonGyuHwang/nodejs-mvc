var boardService = {};


boardService.getBoardRow = async function(args){

    return await boardDao.getDataRow(args);

};

boardService.getBoardList = async function(args){

    return {
        'count': await boardDao.getDataCount(args)
        ,'list': await boardDao.getDataList(args)
    }

};

boardService.insertBoard = async function(args){

    return await boardDao.insertData(args)

};

boardService.updateBoard = async function(args){

    return await boardDao.updateData(args)

};

module.exports = boardService;