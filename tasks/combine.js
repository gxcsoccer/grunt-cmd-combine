/*
 * grunt-cmd-combine
 *
 * Copyright (c) 2013 Peter Gao
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	var script = require('./lib/script').init(grunt),
		configLoader = require('./lib/sea-config-loader').init(grunt),
		path = require('path'),
		async = require('async'),
		stylus = require('stylus');

	grunt.registerMultiTask('combine', 'combine cmd modules.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			separator: grunt.util.linefeed,
			uglify: {
				beautify: true,
				comments: true
			},
			processors: {
				'.js': script.jsConcat
			},
			banner: '',
			footer: ''
		}),
			done = this.async();

		this.files.forEach(function(f) {
			// reset records
			grunt.option('concat-records', {});

			if (options['sea-config-file']) {
				grunt.option('sea-config', configLoader(options['sea-config-file'], options));
			} else {
				grunt.option('sea-config', {});
			}

			// Concat specified files.
			f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).forEach(function(filepath) {
				var extname = path.extname(filepath),
					processor = options.processors[extname];
				if (processor) {
					processor({
						src: filepath
					}, options);
				}
			});

			var records = grunt.option('concat-records'),
				ids = Object.keys(records),
				destpath = path.dirname(f.dest),
				extname = path.extname(f.dest),
				basename = path.basename(f.dest, extname);

			src = options.banner + grunt.option('sea-config').raw + grunt.util.normalizelf(options.separator) + ids.filter(function(id) {
				return path.extname(id) !== '.css';
			}).map(function(id) {
				return records[id];
			}).join(grunt.util.normalizelf(options.separator)) + options.footer;

			if (!/\n$/.test(src)) {
				src += '\n';
			}

			grunt.file.write(path.join(destpath, basename + '.js'), src);

			// process css modules
			async.series(ids.filter(function(id) {
				return path.extname(id) === '.css';
			}).map(function(id) {
				return function(callback) {
					stylus(str)
						.set('filename', id)
						.define('url', stylus.url())
						.render(callback);
				};
			}), function(err, results) {
				if (err) {
					throw err;
				}

				if (results.length) {
					src = options.banner + results.join(grunt.util.normalizelf(options.separator)) + options.footer;

					if (!/\n$/.test(src)) {
						src += '\n';
					}

					grunt.file.write(path.join(destpath, basename + '.css'), src);
				}

				grunt.log.writeln('Combine ' + ids.length.toString().cyan + ' files');
				done();
			});
		});
	});
};