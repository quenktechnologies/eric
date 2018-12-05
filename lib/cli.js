"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git = require("nodegit");
var path_1 = require("path");
var property_seek_1 = require("property-seek");
var file_1 = require("@quenk/noni/lib/io/file");
var string_1 = require("@quenk/noni/lib/data/string");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var polate_1 = require("@quenk/polate");
exports.EXT_ERIC = '.eric';
var polateOptions = {
    start: '{{{',
    end: '}}}'
};
/**
 * args2Opts converts Arguments to an Options object.
 */
exports.args2Opts = function (args) { return ({
    url: args['<url>'],
    out: expand(process.cwd(), args['--out'] || repoName(args['<url>'])),
    context: mkContext({}, args['--set'])
}); };
var mkContext = function (ctx, sets) {
    return sets.reduce(function (p, c) {
        var v = c.split('=');
        return property_seek_1.set(v[0], v[1], p);
    }, ctx);
};
var repoName = function (path) {
    return path_1.basename(path).split('.git').join('');
};
var expand = function (parent, name) {
    return path_1.isAbsolute(name) ? name : path_1.join(parent, name);
};
/**
 * exec the program.
 */
exports.exec = function (opts) {
    return clone(opts.url, opts.out, {})
        .chain(interpolate(opts));
};
var clone = function (url, dest, opts) {
    return future_1.liftP(function () { return git.Clone.clone(url, dest, opts).then(function () { }); });
};
var interpolate = function (opts) { return function () {
    return file_1.listFilesRec(opts.out)
        .chain(function (files) {
        return future_1.parallel(files
            .filter(function (f) { return string_1.endsWith(f, exports.EXT_ERIC); })
            .map(function (f) {
            return interp(opts.context, f)
                .chain(function () { return eraseEricFile(f); });
        }));
    });
}; };
var interp = function (ctx, path) {
    return file_1.readTextFile(path)
        .map(function (txt) { return polate_1.polate(txt, ctx, polateOptions); })
        .chain(writeEricFile(path));
};
var writeEricFile = function (path) { return function (contents) {
    return file_1.writeTextFile(path.split(exports.EXT_ERIC).join(''), contents);
}; };
var eraseEricFile = function (path) { return file_1.unlink(path); };
//# sourceMappingURL=cli.js.map