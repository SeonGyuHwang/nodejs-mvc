function sendPopup(args, params) {
	if( !jQuery ) return;

	var def = {
		'method': 'get',
		'target': 'formPopup'
	};
	params = params || {};

	if( typeof args == 'object' ) {

		jQuery.each(args, function(i, v){
			def[i] = v;
		});

	} else {
		def.action = args;
	}

	if( !def.action ) {
		alert('팝업 URL이 누락 되었습니다.');
	} else {

		var windowPopup = window.open('about:blank', def.target, 'top=0,left=0,width=300,height=200,scrollbars=yes,toolbar=no');
		if( !windowPopup ) {
			alert('팝업차단 해제 후 다시 시도해주세요.');
			windowPopup.close();
		} else {
			jQuery('head', windowPopup.document).append("<title>불러오는중..</title>");
			jQuery('body', windowPopup.document)
				.css({
					'margin': 0
					,'padding': 0
					,'overflow': 'hidden'
				})
				.html("<div style='padding:0;margin:0;width:100%;text-align: center;overflow: hidden;line-height:150px;'><h2>로드중..</h2></div>");

			var newForm = jQuery('<form />');
			newForm.attr(def);
			newForm.appendTo('body');

			jQuery.each(params, function(i, v){

				newForm.append('<input type="hidden" name="'+ i +'" class="'+ i +'" value="'+ v +'" />');

			});


			newForm
				.submit()
				.remove();
		}

		return windowPopup;
	}

	return void(0);
}


window.publicLayer = {
	'useLayer': false,
	'isResize': true,
	'o': '_layer_',
	'v': '_layerOveray_',
	'w': jQuery(window).width()*0.8,
	'h': jQuery(window).height()*0.8,
	'reset': function(){
		jQuery("._layers_").remove();

		this.useLayer = false;
		this.w = jQuery(window).width()*0.8;
		this.h = jQuery(window).width()*0.8;
		this.o = '_layer_';
		this.v = '_layerOveray_';
	},
	'resize': function(){
		if( this.useLayer ) {
			if( this.isResize ) {
				jQuery('.' + this.o).css({
					'top': ( jQuery(window).scrollTop() + (jQuery(window).height() - parseInt(this.h)) / 2 ) + 'px',
					'left': ( jQuery(window).width() / 2 ) - ( parseInt(this.w) / 2 ) + 'px'
				});
			}


			jQuery('.'+this.v).css({
				'width': jQuery(document).width()+'px',
				'height': jQuery(document).height()+'px'
			});
		}
	},
	'setCss': function(options){
		if( options )
			jQuery('.'+this.o).css(options);
	},
	'setHtml': function(addHtml){
		jQuery('body').append( '<div class="'+ this.o +' _layers_"></div>' );
		jQuery('body').append( '<div class="'+ this.v +' _layers_"></div>' );

		jQuery('.'+this.v).css({
			'width': jQuery(document).width()+'px',
			'height': jQuery(document).height()+'px',
			'position': 'absolute',
			'top': '0',
			'left': '0',
			'z-index': '10000',
			'filter': 'alpha(opacity=50)',
			'-khtml-opacity': '0.5',
			'-moz-opacity': '0.5',
			'opacity': '0.5',
			'background-color': '#000',
			'display': 'none'
		});

		jQuery('.'+this.o).css({
			'top': ( jQuery(window).scrollTop() + (jQuery(window).height() - this.h) / 2 )+'px',
			'left': ( jQuery(window).width() / 2 ) - ( this.w / 2 )+'px',
			'width': this.w,
			'height': this.h,
			'position': 'absolute',
			'padding': '0px',
			'background-color': '#fff',
			'border-radius': '10px',
			'-moz-border-radius': '10px',
			'-webkit-border-radius': '10px',
			'overflow': 'hidden',
			'cursor': 'default',
			'z-index': '10001',
			'display': 'none'
		});

		jQuery('.'+this.o).html(addHtml);
	},
	'setSize': function(w, h, resize){
		this.isResize = resize != false ? true : false;
		this.w = w || jQuery(window).width()*0.8;
		this.h = h || jQuery(window).height()*0.8;
	},
	'init': function(){
		this.useLayer = true;
		jQuery('._layers_').show();

		jQuery(window).resize(function(){ publicLayer.resize(); });
		jQuery(window).scroll(function(){ publicLayer.resize(); });
		jQuery(document).on('click touchstart', '.publicLayerCloseBtn', function(e){
			e.preventDefault();
			publicLayer.reset();
		});
	}
};

window.queryString = {
	'setArr' : [],
	'init': function(){
		var URI = location.href.split("?");
		if(URI.length > 1){
			URI = URI[1].split("&");
			for(var i in URI)
				if(URI[i])
					this.setArr[this.setArr.length] = { key: URI[i].split("=")[0], value: URI[i].split("=")[1] };
		}
	},
	'getParam': function(getKey){
		var getValue = '';
		if(this.setArr.length > 0){
			for(var i in this.setArr)
				if(this.setArr[i].key == getKey)
					getValue = this.setArr[i].value;
		}

		return getValue;
	},
    'getQueryString': function(exclude, custom){
        var getString = [];
        custom = custom || [];

        var set_arr = custom.length > 0 ? custom : this.setArr;

        if(set_arr.length > 0){
            exclude = exclude || [];
            for(var i in set_arr)
                if( exclude.indexOf(set_arr[i].key) === -1 )
                    getString.push(set_arr[i].key+'='+set_arr[i].value)
        }

        return getString.length > 0 ? getString.join('&amp;')+'&amp;' : '';
    }
};

window.delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();
