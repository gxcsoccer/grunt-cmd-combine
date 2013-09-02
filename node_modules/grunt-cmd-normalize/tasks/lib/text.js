var path = require('path'),
    format = require('util').format;

exports.init = function(grunt) {
    var ast = require('cmd-util').ast,
        exports = {};

    exports.html2jsParser = function(fileObj, options) {
        // don't transport debug html files
        if (/\-debug\.html/.test(fileObj.src)) return;

        grunt.log.verbose.writeln('Nomarlize ' + fileObj.src + ' -> ' + fileObj.dest);
        // transport html to js
        var data = fileObj.srcData || grunt.file.read(fileObj.src);
        var id = unixy(options.idleading + fileObj.name.replace(/\.js$/, ''));

        data = html2js(data, id);
        data = ast.getAst(data).print_to_string(options.uglify);
        var dest = fileObj.dest + '.js';
        grunt.file.write(dest, data);
    };

    return exports;
};

// helpers
// ---------------

function html2js(code, id) {
    var tpl = 'define("%s", [], "%s");';

    code = code.split(/\r\n|\r|\n/).map(function(line) {
        return line.replace(/\\/g, '\\\\');
    }).join('\n');

    code = format(tpl, id, code.replace(/\"/g, '\\\"'));
    return code;
}

function unixy(uri) {
    return uri.replace(/\\/g, '/');
}

exports.html2js = html2js;