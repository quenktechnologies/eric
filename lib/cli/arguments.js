"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var os_1 = require("os");
var property_seek_1 = require("property-seek");
var file_1 = require("@quenk/noni/lib/io/file");
var record_1 = require("@quenk/noni/lib/data/record");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var interp_1 = require("@quenk/jcon/lib/interp");
var node_1 = require("@quenk/jcon/lib/interp/context/global/node");
exports.FILE_ERICRC = '.ericrc';
exports.EXT_ERIC = '.eric';
/**
 * commands supported.
 */
exports.commands = ['get', 'inspect'];
/**
 * toOptions converts Arguments to an Options object.
 *
 * Defaults are included for the --out and --context flags.
 * If the user's home directory contains an .ericrc file
 * then we read context information from there as well.
 */
exports.toOptions = function (args) {
    return readRCFile()
        .chain(joinRCFile(args));
};
var joinRCFile = function (args) { return function (ctx) {
    return future_1.parallel(args['--context'].map(readJCONFile))
        .map(function (ctxs) { return ctxs.reduce(record_1.rmerge, ctx); })
        .map(function (context) { return record_1.rmerge({ context: context }, mkOptions(args)); });
}; };
var readRCFile = function () {
    return file_1.exists(ericrc())
        .chain(defaultRCFile);
};
var defaultRCFile = function (yes) {
    return yes ? readJCONFile(ericrc()) : future_1.pure({});
};
var ericrc = function () {
    return path_1.join(os_1.homedir(), exports.FILE_ERICRC);
};
var readJCONFile = function (path) {
    return file_1.readTextFile(path)
        .chain(interpJCON(path));
};
var interpJCON = function (path) { return function (txt) {
    return interp_1.interp(node_1.newContext(path_1.dirname(path)), txt);
}; };
var mkOptions = function (args) { return ({
    url: args['<url>'],
    out: getOut(args),
    context: addSets({}, args['--set']),
    command: getCommand(args)
}); };
var getOut = function (args) {
    return (args['<url>']) ?
        expand(process.cwd(), args['--out'] || repoName(args['<url>'])) :
        '';
};
var getCommand = function (args) {
    return exports.commands.reduce(function (p, c) { return (p !== '') ? p : (args[c] === true) ? c : p; }, '');
};
var addSets = function (ctx, sets) {
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
//# sourceMappingURL=arguments.js.map