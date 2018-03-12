(function($) {
	"use strict";

	window.getDataList = function(){

        window.publicDataTable = $(".publicDataTable").DataTable({
            "paging": true
            ,"serverSide": true
            ,"processing": false
            ,"displayStart": /(^[0-9]+$)/.test(queryString.getParam('start')) ? queryString.getParam('start') : 0
            ,"pageLength": 10
            ,"bSort": false
            ,"bFilter": false
            ,"sPaginationType": "full_numbers"
            ,"order": [[ 0, "desc" ]]
            ,"createdRow": function(row, data, dataIndex){
                var info = $('.publicDataTable').DataTable().page.info();

                var page = (parseInt(info.page)+1);
                var limit = parseInt(info.length);
                var total = parseInt(info.recordsTotal);

                var numCount = total - ( limit * (page-1) );
                $(row).children(":first").html( numCount-parseInt(dataIndex) );
            }
            ,"ajax": {
                "url": $('.publicDataTable').data('base-uri')+"/getDataList",
                "dataSrc": function(data) {
                    window.table_start = $('.publicDataTable').DataTable().page.info().start || 0;

                    return data.arr.list;
                },
                "type": "GET",
                "data": function(param) {
                    param.sch_start_date = $('.sch_start_date').val();
                    param.sch_end_date = $('.sch_end_date').val();
                }
            }
            ,"columns": [
                { data: 'board_pk', sClass:"text-center"}
                ,{
                    "render": function ( data, type, row ) {
                        var html = "<a href='/board/view/"+ row['board_pk'] +"?start="+ table_start +"'>"+row['board_title']+"</a>";

                        return html;
                    }
                    ,sClass:"center"
                }
                ,{ data: 'writer_id', sClass:"text-center"}
                ,{ data: 'created_date_format', sClass:"text-center"}
                ,{ data: 'view_cnt', sClass:"text-center"}
            ]
        });

	};

	var _init = function(){

		if( $('.publicDataTable').length > 0 )
			getDataList();

	};

	$(function(){
		_init();

		$(this).on('click', '.writePopupBtn', function(e){
			sendPopup($('.boardWrap').data('write-popup-url'), {'pk': $(e.currentTarget).data('pk') || ''});
		});

        $(this).on('click', '.delBtn', function(e){

            if( confirm('해당 데이터를 삭제 하시겠습니까?') ) {

                $.ajax({
                    type: "post",
                    url: "/board/deleteData",
                    async: true,
                    data: {
                        'idx': $(e.currentTarget).data('pk')
                    },
                    dataType: "json",
                    success: function (data) {
                        alert(data.msg);

                        if( data.status == '200' ) {

                            if( window.opener ) {
                                window.opener.location.replace(data.openerUrl);
                                window.close();
                            } else {
                                location.replace(data.openerUrl);
                            }

                        }

                    },
                    error: function (xhr, status, error) {
                        console.info("에러사유", error);
                    }
                });

            }

        });

		$(this).on('change', '.sch_start_date,.sch_end_date', function(e){
			publicDataTable.draw();
		});

	});

})( jQuery );