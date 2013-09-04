var ast = require('cmd-util').ast;

exports.init = function(grunt) {
	var exports = {};

	exports.jsConcat = function(fileObj, options) {
		var data = grunt.file.read(fileObj.src),
			meta = ast.parse(data);

		meta.forEach(function() {

		});
	};

	return exports;
};