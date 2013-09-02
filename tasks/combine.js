/*
 * grunt-cmd-combine
 *
 * Copyright (c) 2013 Peter Gao
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	var script = require('./lib/script').init(grunt);

	grunt.registerMultiTask('combine', 'combine cmd modules.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			separator: grunt.util.linefeed,
			uglify: {
				beautify: true,
				comments: true
			},
			paths: ['sea-modules'],
			processors: {
				'.js': script.jsConcat
			},
			include: 'self',
			noncmd: false,
			banner: '',
			footer: ''
		}),
			count = 0;

		this.files.forEach(function(f) {
			// reset records
			grunt.option('concat-records', []);

			// Concat specified files.
			var src = options.banner + f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				var extname = path.extname(filepath);
				var processor = options.processors[extname];
				if (!processor || options.noncmd) {
					return grunt.file.read(filepath);
				}
				return processor({
					src: filepath
				}, options);
			}).join(grunt.util.normalizelf(options.separator));

			if (/\.js$/.test(f.dest) && !options.noncmd) {
				var astCache = ast.getAst(src);
				var idGallery = ast.parse(astCache).map(function(o) {
					return o.id;
				});

				src = ast.modify(astCache, {
					dependencies: function(v) {
						if (v.charAt(0) === '.') {
							var altId = iduri.absolute(idGallery[0], v);
							if (grunt.util._.contains(idGallery, altId)) {
								return v;
							}
						}
						var ext = path.extname(v);
						// remove useless dependencies
						if (ext && ext !== '.js') return null;
						return v;
					}
				}).print_to_string(options.uglify);
			}
			// ensure a new line at the end of file
			src += options.footer;

			if (!/\n$/.test(src)) {
				src += '\n';
			}

			// Write the destination file.
			grunt.file.write(f.dest, src);

			// Print a success message.
			grunt.log.verbose.writeln('File "' + f.dest + '" created.');
			count++;
		});
		grunt.log.writeln('Concated ' + count.toString().cyan + ' files');
	});
}