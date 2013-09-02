exports.init = function(grunt) {
    var path = require('path'),
        format = require('util').format,
        ast = require('cmd-util').ast,
        exports = {};

    exports.jsonParser = function(fileObj, options) {
        var dest = fileObj.dest + '.js';
        grunt.log.verbose.writeln('Nomarlize ' + fileObj.src + ' -> ' + dest);

        var id = unixy(options.idleading + fileObj.name.replace(/\.js$/, ''));
        var data = fileObj.srcData || grunt.file.read(fileObj.src);
        var code = format('define("%s", [], %s)', id, data);
        var astCache = ast.getAst(code);

        data = astCache.print_to_string(options.uglify);
        grunt.file.write(dest, data);
    };
    return exports;
};

function unixy(uri) {
    return uri.replace(/\\/g, '/');
}