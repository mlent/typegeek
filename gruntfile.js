module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['src/typegeek.js'],
			options: {
				globals: {
					console: true,
					module: true,
					document: true
				}
			}
		},
		cssmin: {
			compress: {
				files: {
					'dist/<%= pkg.name %>.min.css': ['src/<%= pkg.name %>.css']
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: '/opt/phaidra',
					mainConfigFile: 'static/lib/<%= pkg.name %>/demo/main.js',
					name: 'static/lib/<%= pkg.name %>/src/<%= pkg.name %>',
					out: 'static/lib/<%= pkg.name %>/dist/<%= pkg.name %>.min.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['jshint', 'requirejs', 'cssmin']);
	grunt.registerTask('test', ['jshint']);
};
