exports.init = function(grunt) {
	var exports = {};

	exports.cssConcat = function(fileObj, options) {
		var records = grunt.option('concat-records'),
			filepath = fileObj.src,
			src = grunt.file.read(filepath);

		records[filepath] = src;
	};

	return exports;
};