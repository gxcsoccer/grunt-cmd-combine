exports.init = function(grunt) {
	var ast = require('cmd-util').ast,
		path = require('path'),
		exports = {};

	// Regular Expression
	var PATHS_RE = /^([^/:]+)(\/.+)$/,
		ABSOLUTE_RE = /^\/\/.|:\//,
		ROOT_DIR_RE = /^.*?\/\/.*?\//,
		PATH_SEP = /^\/|\\$/;

	exports.jsConcat = function(fileObj, options) {
		var config = grunt.option('sea-config'),
			records = grunt.option('concat-records');

		if (config.cwd) {
			config.cwd = path.dirname(fileObj.src);
			PATH_SEP.test(config.cwd.slice(-1)) || (config.cwd += '/');
			config.base = config.base || '.';
			if (config.base.charAt(0) = '.') {
				config.base = addBase(config.base);
			}
		}

		combine(fileObj.src);

		function combine(filepath) {
			var id = unixy(path.relative(config.base, filepath)),
				src, astCache, meta;

			if (records[id]) return;

			src = grunt.file.read(filepath);
			astCache = ast.getAst();
			meta = ast.parseFirst(astCache);

			records[id] = ast.modify(astCache, {
				id: id,
				dependencies: meta.dependencies
			});

			meta.dependencies.forEach(function(dep) {
				var uri = id2Uri(dep, filepath);

				// todo: handle css module
				combine(uri);
			});
		}

		// Helper
		// -------------

		function unixy(uri) {
			return uri.replace(/\\/g, '/');
		}

		function parseAlias(id) {
			var alias = config.alias;
			return alias && isString(alias[id]) ? alias[id] : id;
		}

		function parsePaths(id) {
			var paths = config.paths,
				m;

			if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
				id = path.join(paths[m[1]], m[2]);
			}

			return id;
		}

		function addBase(id, refUri) {
			var ret,
				first = id.charAt(0);

			// Absolute
			if (ABSOLUTE_RE.test(id)) {
				ret = id;
			}
			// Relative
			else if (first === ".") {
				ret = path.normalize(path.join((refUri ? dirname(refUri) : config.cwd) + id));
			}
			// Root
			else if (first === "/") {
				var m = config.cwd.match(ROOT_DIR_RE);
				ret = m ? path.join(m[0], id.substring(1)) : id;
			}
			// Top-level
			else {
				ret = path.join(config.base, id);
			}

			return ret;
		}

		function id2Uri(id, refUri) {
			if (!id) return "";

			id = parseAlias(id);
			id = parsePaths(id);
			id = normalize(id);

			var uri = addBase(id, refUri);
			return uri;
		}

		// Normalize an id
		// normalize("path/to/a") ==> "path/to/a.js"
		// NOTICE: substring is faster than negative slice and RegExp

		function normalize(path) {
			var last = path.length - 1,
				lastC = path.charAt(last);

			// If the uri ends with `#`, just return it without '#'
			if (lastC === "#") {
				return path.substring(0, last);
			}

			return (path.substring(last - 2) === ".js" ||
				path.indexOf("?") > 0 ||
				path.substring(last - 3) === ".css" ||
				lastC === "/") ? path : path + ".js";
		}
	};

	return exports;
};