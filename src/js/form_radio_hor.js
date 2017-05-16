/**
 * 
 * @authors tianyanrong
 * @date    2014-12-22
 * @version 
 */
var Radio = null
;(function($) {
	Radio = function() {
		this.radioElements = {}
		this.$radio = $('input[type="radio"]');
		this._CSS1=arguments.length==2?arguments[0]:{
				'width': '1.46rem',
				'height': '1.46rem',
				'display': 'inline-block',
				'float': 'right',
				'margin-top': '0.695rem'
			};
		this._CSS2=arguments.length==2?arguments[1]:{
				'line-height': '2.75rem',
				'cursor': 'pointer'
			};
		this.init();
		this.bindAction();
	}
	Radio.prototype = {
		init: function() {
			var _this = this;
			var $radio = this.$radio;
			$radio.each(function() {
				var $el = $(this);
				var $span = $('<span type="radio"></span>');
				var name = $el.name;
				var elements = {
					radio: $el,
					el: $span,
					parent: $el.parent('label')
				}
				_this.radioElements[name] = _this.radioElements[name] || [];
				_this.radioElements[name].push(elements);
				$el.after($span);
				_this.setStyle(elements);
			})			
		},
		bindAction: function() {
			var _this = this;
			var parent = $('[type="radio"]').parent('label');
			parent.click(function(event) {
				var radio = $(this).find('input[type="radio"]');
				var isDisabled = radio.attr('disabled') || radio.attr('readonly');
				if(isDisabled && 'false' !== isDisabled) {
					return;
				}
				var el = $(this).find('span[type="radio"]');
				radio.attr('checked', true);
				var name = radio.attr('name');
				$('input[type="radio"][name="'+name+'"]').trigger('radio_change');
			});
			this.$radio.bind('radio_change', function() {
				_this.setActive($(this));
			})

		},
		setActive: function(radio) {
			var el = radio.next('span[type="radio"]');
			if(radio[0].checked) {
				background = 'url("http://static.17shihui.com/pageapp/js/form_radio/images/checked.png") center no-repeat';
			}
			else {
				background = 'url("http://static.17shihui.com/pageapp/js/form_radio/images/uncheck.png")  center no-repeat';
			}
			el.css({
				'background': background,
				'background-size': 'auto 100%',
				'-moz-background-size': 'auto 100%',
				'-webkit-background-size': 'auto 100%'
			});
		},
		setStyle: function(elements) {
			var radio = elements.radio;
			var el =  elements.el;
			var parent = elements.parent;
			radio.css({
				'display': 'none'
			});
			el.css(this._CSS1);
			parent.css(this._CSS2)
			this.setActive(radio);
		}
	}
	if(!_PublicParam2016){
		new Radio()
	}	
})(Zepto);