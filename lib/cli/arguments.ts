import { basename, isAbsolute, join, dirname } from 'path';
import { homedir } from 'os';
import { set } from 'property-seek';
import {
    Path,
    readTextFile,
    exists,
} from '@quenk/noni/lib/io/file';
import { rmerge } from '@quenk/noni/lib/data/record';
import { Object } from '@quenk/noni/lib/data/json';
import { Future, parallel, pure } from '@quenk/noni/lib/control/monad/future';
import { interp } from '@quenk/jcon/lib/interp';
import { newContext } from '@quenk/jcon/lib/interp/context/global/node';
import { Context, Options } from './options';

export const FILE_ERICRC = '.ericrc';
export const EXT_ERIC = '.eric';

/**
 * commands supported.
 */
export const commands = ['get', 'inspect'];

/**
 * Arguments passed via the cli.
 */
export interface Arguments extends Object {

    '--set': string[],

    '--context': string[],

    '--out': string

    '<url>': string

}

/**
 * toOptions converts Arguments to an Options object.
 *
 * Defaults are included for the --out and --context flags.
 * If the user's home directory contains an .ericrc file
 * then we read context information from there as well.
 */
export const toOptions = (args: Arguments): Future<Options> =>
    readRCFile()
        .chain(joinRCFile(args));

const joinRCFile = (args: Arguments) => (ctx: Context): Future<Options> =>
    parallel(args['--context'].map(readJCONFile))
        .map(ctxs => ctxs.reduce(rmerge, ctx))
        .map(context => rmerge({ context }, mkOptions(args)));

const readRCFile = (): Future<Context> =>
    exists(ericrc())
        .chain(defaultRCFile);

const defaultRCFile = (yes: boolean): Future<Context> =>
    yes ? readJCONFile(ericrc()) : pure({});

const ericrc = () =>
    join(homedir(), FILE_ERICRC);

const readJCONFile = (path: Path): Future<Context> =>
    readTextFile(path)
        .chain(interpJCON(path));

const interpJCON = (path: Path) => (txt: string): Future<Context> =>
    interp(newContext(dirname(path)), txt);

const mkOptions = (args: Arguments) => ({

    url: args['<url>'],

    out: getOut(args),

    context: addSets({}, args['--set']),

    command: getCommand(args)

});


const getOut = (args: Arguments) =>
    (args['<url>']) ?
        expand(process.cwd(), args['--out'] || repoName(args['<url>'])) :
        '';

const getCommand = (args: Arguments): string =>
    commands.reduce((p, c) => (p !== '') ? p : (args[c] === true) ? c : p, '');

const addSets = (ctx: Context, sets: string[]): Context =>
    sets.reduce((p, c) => {

        let v = c.split('=');
        return set(v[0], v[1], p);

    }, ctx);

const repoName = (path: Path) =>
    basename(path).split('.git').join('');

const expand = (parent: Path, name: string): Path =>
    isAbsolute(name) ? name : join(parent, name);
