function validMe(validform, callback) {
	// validform - jQuery selector as $('form')
	// callback - function(errors){}
	// use attr for input: [required] [type = tel, email] [pattern = "..."]
	// TODO data-validate-type = url, number, etc
	// TODO min,max

	validform.each(function(){
		var pattern_mail = '^[a-zA-Z0-9а-яА-ЯёЁ\\._-]+@[a-zA-Z0-9а-яА-ЯёЁ_-]+\\.[a-zA-Z0-9а-яА-ЯёЁ]+$';
		var pattern_phone = '^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$';
		var pattern_required = '[^\s]+';

		$(this).find('[required]').each(function(){
			$(this).prop('required',false).attr('data-validate-required','');
		});

		$(this).find('[type="email"]').each(function(){
			$(this).attr('type','text').attr('data-validate-pattern',pattern_mail);
		});
		$(this).find('[type="tel"]').each(function(){
			//$(this).attr('type','text');
			$(this).attr('data-validate-pattern',pattern_phone);
		});
		$(this).find('[pattern]').each(function(){
			$(this).attr('data-validate-pattern',$(this).attr('pattern')).removeAttr('pattern');
		});

		$(this).submit(function(){
			var valid_form = $(this);
			var valid_errors = new Array();
			$(this).find('[data-validate-required], [data-validate-pattern]').each(function(){
				if($(this).prop('disabled')) return;
				if($(this).prop('readonly')) return;

				var valid_required = $(this).is('[data-validate-required]');
				var valid_val = $(this).val();
				var valid_it = true;

				if($(this).is('[type="checkbox"]')){
					if(!$(this).prop('checked')){
						valid_it = false;
					}
				}else if($(this).is('[type="radio"]')){
					if(!valid_form.find('input[name="'+$(this).attr('name')+'"]:checked').length){
						valid_it = false;
					}
				}else{
					if(valid_required){
						if(!valid_val){
							//if is <select multiply>
							valid_it = false;
						}else if((typeof(valid_val) == 'string') && !valid_val.match(pattern_required)){
							//text, tel, email, etc
							valid_it = false;
						}
					}
					var valid_match = $(this).attr('data-validate-pattern');
					if(valid_match && valid_val && (typeof(valid_val) == 'string') && !valid_val.match(valid_match)){
						valid_it = false;
					}
				}
				if(!valid_it){
					$(this).addClass('error');
					valid_errors.push($(this));
				}else{
					$(this).removeClass('error');
				}

			});


			var r = !valid_errors.length;
			if(callback) r = r && callback(valid_errors);
			return r;
		});

	});
}