import { join, dirname } from 'path';
import { homedir } from 'os';

import {
    Path,
    readTextFile,
    exists,
} from '@quenk/noni/lib/io/file';
import { merge, rmerge } from '@quenk/noni/lib/data/record';
import { Object, Value } from '@quenk/noni/lib/data/jsonx';
import {
    Future,
    doFuture,
    parallel,
    pure
} from '@quenk/noni/lib/control/monad/future';
import { set } from '@quenk/noni/lib/data/record/path';

import { interp } from '@quenk/jcon/lib/interp';
import { newContext } from '@quenk/jcon/lib/interp/context/global/node';

import { Options } from './command/options';
import { Context } from '../project/context';

/**
 * Arguments passed via the cli.
 */
export interface Arguments extends Object {

    '--set': string[],

    '--context': string[],

    '<url>': string,

    '<path>': string

}

const defaults: Partial<Arguments> = {

    '<url>': '',

    '<path>': '',

    '--set': [],

    '--context': []

}

/**
 * toOptions converts an [[Arguments]] object to an Options object.
 *
 * Defaults are included for the --context flag. If the user's home directory
 * contains an .ericrc file then we read context information from there as well.
 */
export const toOptions = (args: Arguments): Future<Options> =>
    doFuture(function*() {

        args = merge(defaults, args);

        let rcPath = join(homedir(), '.ericrc');

        let context: Object =
            (yield exists(rcPath)) ? yield readJCONFile(rcPath) : {};

        let otherCtxs: Object[] =
            yield parallel(args['--context'].map(readJCONFile));

        context = args['--set'].reduce((prev: Object, curr) => {

            let [path, value] = curr.split('=');

            return set<Value, Object>(path, value, prev);

        }, otherCtxs.reduce(rmerge, context));

        let command = getCommand(args);

        let src = args['<url>'];

        let dest = args['<path>'];

        return pure({ src, dest, context, command });

    });

const readJCONFile = (path: Path): Future<Context> =>
    doFuture(function*() {

        let txt: string = yield readTextFile(path);

        return interp(newContext(dirname(path)), txt);

    })

const commands = ['get', 'inspect'];

const getCommand = (args: Arguments): string =>
    commands.reduce((p, c) => (p !== '') ? p : (args[c] === true) ? c : p, '');
