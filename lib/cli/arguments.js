"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOptions = void 0;
const path_1 = require("path");
const os_1 = require("os");
const file_1 = require("@quenk/noni/lib/io/file");
const record_1 = require("@quenk/noni/lib/data/record");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const path_2 = require("@quenk/noni/lib/data/record/path");
const interp_1 = require("@quenk/jcon/lib/interp");
const node_1 = require("@quenk/jcon/lib/interp/context/global/node");
const defaults = {
    '<url>': '',
    '<path>': '',
    '--set': [],
    '--context': []
};
/**
 * toOptions converts an [[Arguments]] object to an Options object.
 *
 * Defaults are included for the --context flag. If the user's home directory
 * contains an .ericrc file then we read context information from there as well.
 */
const toOptions = (args) => (0, future_1.doFuture)(function* () {
    args = (0, record_1.merge)(defaults, args);
    let rcPath = (0, path_1.join)((0, os_1.homedir)(), '.ericrc');
    let context = (yield (0, file_1.exists)(rcPath)) ? yield readJCONFile(rcPath) : {};
    let otherCtxs = yield (0, future_1.parallel)(args['--context'].map(readJCONFile));
    context = args['--set'].reduce((prev, curr) => {
        let [path, value] = curr.split('=');
        return (0, path_2.set)(path, value, prev);
    }, otherCtxs.reduce(record_1.rmerge, context));
    let command = getCommand(args);
    let src = args['<url>'];
    let dest = args['<path>'];
    return (0, future_1.pure)({ src, dest, context, command });
});
exports.toOptions = toOptions;
const readJCONFile = (path) => (0, future_1.doFuture)(function* () {
    let txt = yield (0, file_1.readTextFile)(path);
    return (0, interp_1.interp)((0, node_1.newContext)((0, path_1.dirname)(path)), txt);
});
const commands = ['get', 'inspect'];
const getCommand = (args) => commands.reduce((p, c) => (p !== '') ? p : (args[c] === true) ? c : p, '');
//# sourceMappingURL=arguments.js.map