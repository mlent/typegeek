requirejs.config({
	'baseUrl': '/static/js',
	'paths': {
		'typegeek': 'lib/typegeek/src/typegeek'
	}
});

require(['typegeek'], function(TypeGeek) {
	new TypeGeek('[data-toggle="typegeek"]');
});
