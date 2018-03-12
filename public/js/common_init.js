(function($) {
	"use strict";

	var _init = function(){

		if( $('.publicFrm').length > 0 ) {
			$('.publicFrm').ajaxForm({
				dataType: 'json',
				resetForm: false,
				success: function (data) {
					//console.log(data);
					if (data.msg != '') alert(data.msg);
					if (data.url != '') location.href = data.url;
					if (data.openerUrl != '') window.opener.location.href = data.openerUrl;

					if (data.reload == 'on') location.reload();
					if (data.dataReload == 'on') getDataList();
					if (data.openerReload == 'on') window.opener.location.reload();
					if (data.openerDataReload == 'on') window.opener.publicDataTable.draw();
					if (data.close == 'on') window.close();
				},
				error: function (xhr, status, error) {
					alert("ajaxForm 에러사유 : " + error);
					//console.log(status);
					//console.log(error);
				}
			});
		}


		$.extend( true, $.fn.dataTable.defaults, {
			aLengthMenu: [[10, 25, 50, 200, 500], [10, 25, 50, 200, 500]],
			oLanguage: {
				"sSearch": "검색 : ",
				"oPaginate": {
					"sFirst" : "처음",
					"sPrevious" : "이전",
					"sNext" : "다음",
					"sLast" : "마지막"
				},
				"sInfo": "총 _TOTAL_개의 항목 중 _START_ ~ _END_ 표시",
				"sLengthMenu": "_MENU_ 개의 항목 표시",
				"sProcessing": "로드중...",
				"sEmptyTable": "조회 된 데이터가 없습니다.",
				"sInfoEmpty": ""
			}
		});

		$.fn.dataTable.ext.search.push(
			function (settings, data, dataIndex) {
				var min = $('.sch_start_date').datepicker("getDate");
				var max = $('.sch_end_date').datepicker("getDate");
				var startDate = new Date(data[3]);
				if (min == null && max == null) {
					return true;
				}
				if (min == null && startDate <= max) {
					return true;
				}
				if (max == null && startDate >= min) {
					return true;
				}
				if (startDate <= max && startDate >= min) {
					return true;
				}
				return false;
			}
		);

		$.datepicker.regional['ko'] = {
			dateFormat: "yy-mm-dd",
			closeText: '닫기',
			prevText: '이전달',
			nextText: '다음달',
			currentText: '오늘',
			monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
			dayNames: ['일','월','화','수','목','금','토'],
			dayNamesShort: ['일','월','화','수','목','금','토'],
			dayNamesMin: ['일','월','화','수','목','금','토'],
			weekHeader: 'Wk',
			firstDay: 0,
			isRTL: false,
			showMonthAfterYear: true,
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			showOn: 'both'
		};
		$.datepicker.setDefaults($.datepicker.regional['ko']);

		$( ".date-picker" ).datepicker();

        queryString.init();
	};

	$(function(){
		_init();

		$(this).ajaxStart(function(){
			publicLayer.reset();

			publicLayer.setSize(200, 50, false);
			publicLayer.setHtml('<div class="loadingWrap" style="text-align:center;line-height:50px;height:50px;padding-top:7px;"><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="35px" height="35px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" /><g><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#000000" fill-opacity="1"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(45 64 64)"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(90 64 64)"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(135 64 64)"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(180 64 64)"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(225 64 64)"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(270 64 64)"/><path d="M38.52 33.37L21.36 16.2A63.6 63.6 0 0 1 59.5.16v24.3a39.5 39.5 0 0 0-20.98 8.92z" fill="#c0c0c0" fill-opacity="0.25" transform="rotate(315 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg></div>');

			if( !window.opener )
				$('.'+publicLayer.v).remove();

			publicLayer.init();

		}).ajaxStop(function() {
			publicLayer.reset();
		});


		$(this).on('keyup', '.numOnly', function(e){
			$(e.currentTarget).val( $(e.currentTarget).val().replace(/[^0-9]/g, '') );
		});
	});

})( jQuery );
