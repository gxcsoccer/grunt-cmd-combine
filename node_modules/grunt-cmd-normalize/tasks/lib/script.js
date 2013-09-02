exports.init = function(grunt) {
	var exports = {},
		ast = require('cmd-util').ast;

	exports.jsParser = function(fileObj, options) {
		grunt.log.verbose.writeln('Nomarlize ' + fileObj.src + ' -> ' + fileObj.dest);
		var astCache, data = grunt.file.read(fileObj.src);
		try {
			astCache = ast.getAst(data);
		} catch (e) {
			grunt.log.error('js parse error ' + fileObj.src.red);
			grunt.fail.fatal(e.message + ' [ line:' + e.line + ', col:' + e.col + ', pos:' + e.pos + ' ]');
		}

		var meta = ast.parseFirst(astCache);

		if (!meta) {
			grunt.log.warn('found non cmd module "' + fileObj.src + '"');
			// do nothing
			return;
		}

		if (meta.id) {
			grunt.log.verbose.writeln('id exists in "' + fileObj.src + '"');
		}

		// create .js file
		astCache = ast.modify(astCache, {
			id: meta.id ? meta.id : unixy(options.idleading + fileObj.name.replace(/\.js$/, '')),
			dependencies: meta.dependencies
		});
		data = astCache.print_to_string(options.uglify);
		grunt.file.write(fileObj.dest, data);
	};

	return exports;
};

// helpers
// ----------------

function unixy(uri) {
	return uri.replace(/\\/g, '/');
}