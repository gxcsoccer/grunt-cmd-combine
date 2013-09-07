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
		combine: {
			dist: {
				options: {
					'sea-config-file': 'test/src/config.js'
				},
				files: {
					'test/dist/a.js': ['test/src/a.js', 'test/src/b.js']
				}
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

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['clean', 'combine', 'mochaTest']);
};