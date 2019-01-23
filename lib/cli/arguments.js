"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.toOptions = (args) => readRCFile()
    .chain(joinRCFile(args));
const joinRCFile = (args) => (ctx) => future_1.parallel(args['--context'].map(readJCONFile))
    .map(ctxs => ctxs.reduce(record_1.rmerge, ctx))
    .map(context => record_1.rmerge({ context }, mkOptions(args)));
const readRCFile = () => file_1.exists(ericrc())
    .chain(defaultRCFile);
const defaultRCFile = (yes) => yes ? readJCONFile(ericrc()) : future_1.pure({});
const ericrc = () => path_1.join(os_1.homedir(), exports.FILE_ERICRC);
const readJCONFile = (path) => file_1.readTextFile(path)
    .chain(interpJCON(path));
const interpJCON = (path) => (txt) => interp_1.interp(node_1.newContext(path_1.dirname(path)), txt);
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
    return property_seek_1.set(v[0], v[1], p);
}, ctx);
const repoName = (path) => path_1.basename(path).split('.git').join('');
const expand = (parent, name) => path_1.isAbsolute(name) ? name : path_1.join(parent, name);
//# sourceMappingURL=arguments.js.map