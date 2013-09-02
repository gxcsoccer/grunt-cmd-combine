/**
 * grunt-cmd-normalize
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
			expected: ['test/expected']
		},
		normalize: {
			cmd: {
				files: [{
					expand: true,
					cwd: 'test/cases/cmd',
					src: ['**/*'],
					dest: 'test/expected/cmd'
				}]
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/normalize.js']
			}
		}
	});

	// load plugins
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['clean', 'normalize', 'mochaTest']);
};