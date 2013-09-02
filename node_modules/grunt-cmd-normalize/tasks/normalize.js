/*
 * grunt-cmd-normalize
 *
 * Copyright (c) 2013 GaoXiaochen
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	var path = require('path'),
		script = require('./lib/script').init(grunt);

	grunt.registerMultiTask('normalize', 'Normalize everything into cmd.', function() {
		var options = this.options({
			idleading: '',
			parsers: {
				'.js': [script.jsParser]
			},
			uglify: {
				beautify: true,
				comments: true
			}
		});

		var fname, destfile, extname, fileparsers, count = 0;
		this.files.forEach(function(fileObj) {
			fileObj.src.forEach(function(fpath) {
				count++;

				if (fileObj.cwd) {
					// not expanded
					fname = fpath;
					fpath = path.join(fileObj.cwd, fpath);
				} else {
					fname = path.relative(fileObj.orig.cwd || '', fpath);
				}
				if (grunt.file.isDir(fpath)) return;

				destfile = path.join(fileObj.orig.dest || fileObj.dest, fname);
				extname = path.extname(fpath);

				fileparsers = options.parsers[extname];
				if (!fileparsers || fileparsers.length === 0) {
					grunt.file.copy(fpath, destfile);
					return;
				}
				if (!Array.isArray(fileparsers)) {
					fileparsers = [fileparsers];
				}

				fileparsers.forEach(function(fn) {
					fn({
						src: fpath,
						name: fname,
						dest: destfile
					}, options);
				});
			});
		});

		grunt.log.writeln('normalize ' + count.toString().cyan + ' files');
	});
};