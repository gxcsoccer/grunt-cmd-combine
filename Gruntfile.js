/**
 * grunt-cmd-combine
 *
 * Copyright (c) 2013 Peter Gao
 */

module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/**/*.js',
				'<%= mochaTest.test.src %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		clean: {
			expected: ['test/dist']
		},
		normalize: {
			all: {
				files: [{
					expand: true,
					cwd: 'test/src',
					src: ['**/*'],
					dest: 'test/dist'
				}]
			}
		},
		combine: {
			dist: {
				options: {

				},
				files: {
					'test/dist/a.js': ['test/src/a.js', 'test/src/b.js']
				},
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/combine.js']
			}
		}
	});

	// load plugins
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-cmd-normalize');

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['clean', 'normalize', 'combine', 'mochaTest', 'clean']);
};