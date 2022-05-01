"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOptions = exports.commands = exports.EXT_ERIC = exports.FILE_ERICRC = void 0;
const path_1 = require("path");
const os_1 = require("os");
const property_seek_1 = require("property-seek");
const file_1 = require("@quenk/noni/lib/io/file");
const record_1 = require("@quenk/noni/lib/data/record");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const interp_1 = require("@quenk/jcon/lib/interp");
const node_1 = require("@quenk/jcon/lib/interp/context/global/node");
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
const toOptions = (args) => readRCFile()
    .chain(joinRCFile(args));
exports.toOptions = toOptions;
const joinRCFile = (args) => (ctx) => (0, future_1.parallel)(args['--context'].map(readJCONFile))
    .map(ctxs => ctxs.reduce(record_1.rmerge, ctx))
    .map(context => (0, record_1.rmerge)({ context }, mkOptions(args)));
const readRCFile = () => (0, file_1.exists)(ericrc())
    .chain(defaultRCFile);
const defaultRCFile = (yes) => yes ? readJCONFile(ericrc()) : (0, future_1.pure)({});
const ericrc = () => (0, path_1.join)((0, os_1.homedir)(), exports.FILE_ERICRC);
const readJCONFile = (path) => (0, file_1.readTextFile)(path)
    .chain(interpJCON(path));
const interpJCON = (path) => (txt) => (0, interp_1.interp)((0, node_1.newContext)((0, path_1.dirname)(path)), txt);
const mkOptions = (args) => ({
    url: args['<url>'],
    out: getOut(args),
    context: addSets({}, args['--set']),
    command: getCommand(args)
});
const getOut = (args) => (args['<url>']) ?
    expand(process.cwd(), args['--out'] || repoName(args['<url>'])) :
    '';
const getCommand = (args) => exports.commands.reduce((p, c) => (p !== '') ? p : (args[c] === true) ? c : p, '');
const addSets = (ctx, sets) => sets.reduce((p, c) => {
    let v = c.split('=');
    return (0, property_seek_1.set)(v[0], v[1], p);
}, ctx);
const repoName = (path) => (0, path_1.basename)(path).split('.git').join('');
const expand = (parent, name) => (0, path_1.isAbsolute)(name) ? name : (0, path_1.join)(parent, name);
//# sourceMappingURL=arguments.js.map