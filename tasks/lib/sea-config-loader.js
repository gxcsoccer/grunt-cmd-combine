var UglifyJS = require('uglify-js');

module.exports.init = function(grunt) {
	return function(filepath, options) {
		var src = grunt.file.read(filepath),
			ast = UglifyJS.parse(src, {}),
			config = {};

		var walker = new UglifyJS.TreeWalker(function(node, descend) {
			if (node instanceof UglifyJS.AST_Call && node.expression.property == 'config') {
				console.log(node);

				return true;
			}
		});
		ast.walk(walker);
		return config;
	};
};