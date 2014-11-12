module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);
	grunt.registerTask('test', ['jshint']);
};
