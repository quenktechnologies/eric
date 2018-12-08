"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var git = require("nodegit");
var file_1 = require("@quenk/noni/lib/io/file");
var string_1 = require("@quenk/noni/lib/data/string");
var function_1 = require("@quenk/noni/lib/data/function");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var polate_1 = require("@quenk/polate");
exports.EXT_ERIC = '.eric';
var polateOptions = {
    start: '{{{',
    end: '}}}'
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
        .map(function_1.noop);
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
                .chain(function () { return eraseEricFile(f); });
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
var eraseEricFile = function (path) {
    return file_1.unlink(path);
};
//# sourceMappingURL=get.js.map