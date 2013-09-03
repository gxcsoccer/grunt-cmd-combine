var ast = require('cmd-util').ast;

exports.init = function(grunt) {
	var exports = {};

	exports.jsConcat = function(fileObj, options) {
		var data = grunt.file.read(fileObj.src),
			astCache = ast.parse(data);

	};

	return exports;
}