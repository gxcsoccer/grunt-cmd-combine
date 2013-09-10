var UglifyJS = require('uglify-js'),
	path = require('path');

module.exports.init = function(grunt) {
	return function(filepath, options) {
		var src = grunt.file.read(filepath),
			ast = UglifyJS.parse(src, {}),
			config = {};

		var walker = new UglifyJS.TreeWalker(function(node, descend) {
			if (node instanceof UglifyJS.AST_Call && node.expression.property === 'config') {
				var arg = node.args[0];
				arg.properties.forEach(function(prop) {
					switch (prop.key) {
						case 'base':
							config['base'] = prop.value.getValue();
							break;
						case 'alias':
							config['alias'] = {};

							prop.value.properties.forEach(function(p) {
								config['alias'][p.key] = p.value.getValue();
							});
							break;
						case 'paths':
							config['paths'] = {};

							prop.value.properties.forEach(function(p) {
								config['paths'][p.key] = p.value.getValue();
							});
							break;
						default:
							return;
					}
				});

				config['raw'] = node.print_to_string(options.uglify);
				delete options.uglify['screw_ie8'];
				return true;
			}
		});
		ast.walk(walker);

		if (!config['base']) {
			config['base'] = '.';
		}

		if (config['base'].charAt(0) === '.') {
			config['base'] = path.resolve(path.dirname(filepath), config['base']);
		}

		return config;
	};
};