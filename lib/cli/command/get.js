"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git = require("nodegit");
var path_1 = require("path");
var file_1 = require("@quenk/noni/lib/io/file");
var string_1 = require("@quenk/noni/lib/data/string");
var function_1 = require("@quenk/noni/lib/data/function");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var polate_1 = require("@quenk/polate");
exports.EXT_ERIC = '.eric';
exports.FILE_GIT = '.git';
exports.FILE_ERIC_JSON = 'eric.json';
var polateOptions = {
    start: '{{{',
    end: '}}}',
    regex: '(.+)'
};
/**
 * Get command.
 *
 * Fetches a repo and processes it's .eric file to establish a new project.
 */
var Get = /** @class */ (function () {
    function Get(options) {
        this.options = options;
    }
    Get.prototype.run = function () {
        return run(this.options);
    };
    return Get;
}());
exports.Get = Get;
var run = function (opts) {
    return clone(opts.url, opts.out, {})
        .chain(interpolate(opts))
        .map(function () { return opts.out; })
        .chain(cleanup);
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
            return inter(opts.context, f)
                .chain(function () { return file_1.unlink(f); });
        }));
    });
}; };
var inter = function (ctx, path) {
    return file_1.readTextFile(path)
        .map(function (txt) { return polate_1.polate(txt, ctx, polateOptions); })
        .chain(writeEricFile(path));
};
var writeEricFile = function (path) { return function (contents) {
    return file_1.writeTextFile(path.split(exports.EXT_ERIC).join(''), contents);
}; };
var cleanup = function (path) {
    return file_1.unlink(path_1.join(path, exports.FILE_GIT))
        .chain(function () { return file_1.exists(path_1.join(path, exports.FILE_ERIC_JSON)); })
        .chain(function (yes) { return yes ? file_1.unlink(path_1.join(path, exports.FILE_ERIC_JSON)) : future_1.pure(function_1.noop()); })
        .map(function_1.noop);
};
//# sourceMappingURL=get.js.map