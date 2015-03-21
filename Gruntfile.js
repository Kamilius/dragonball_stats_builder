module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! "Weekly menu" <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: false,
				compress: false,
				beautify: true
			},
			my_target: {
				files: {
					'build/scripts/main.min.js': [
						'src/scripts/angular.js',
						'src/scripts/script.js'
					]
				}
			}
		},
		haml: {
			dist: {
				options: {
					format: 'html5'
				},
				files: {
					'build/index.html': 'src/index.haml'
				}
			}
		},
		sass: {
			dist: {
				options: {
					//style: 'compressed',
					style: 'expanded',
					lineNumbers: true,
					banner: '/*! "Dragon ball" <%= grunt.template.today("yyyy-mm-dd") %> */'
				},
				files: {
					'build/styles/style.css': 'src/content/styles/styles.sass'
				}
			}
		},
		watch: {
			copy: {
				files: ['src/content/images/*', 'src/content/fonts/*'],
				tasks: 'copy'
			},
			sass: {
				files: ['src/content/styles/*.sass'],
				tasks: 'sass'
			},
			haml: {
				files: ['src/index.haml', 'src/app/views/*.haml'],
				tasks: 'haml'
			},
			uglify: {
				files: ['src/scripts/*.js'],
				tasks: 'uglify'
			}
		},
		copy: {
			main: {
				files: [
					{ expand: true, src:'src/content/images/*', dest:'build/images/', flatten: true },
					{ expand: true, src:'src/content/fonts/*', dest:'build/fonts/', flatten: true }
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-haml2html');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['uglify', 'sass', 'haml', 'copy']);
};
