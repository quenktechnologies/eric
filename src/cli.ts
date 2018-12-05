import * as git from 'nodegit';
import { basename, isAbsolute, join } from 'path';
import { set } from 'property-seek';
import {
    Path,
    listFilesRec,
    readTextFile,
    writeTextFile,
    unlink
} from '@quenk/noni/lib/io/file';
import { endsWith } from '@quenk/noni/lib/data/string';
import { Object } from '@quenk/noni/lib/data/json';
import { Future, parallel, liftP } from '@quenk/noni/lib/control/monad/future';
import { polate } from '@quenk/polate';

export const EXT_ERIC = '.eric';

const polateOptions = {

    start: '{{{',

    end: '}}}'

}

export type Context = Object;

/**
 * Arguments passed via the cli.
 */
export interface Arguments {

    '--set': string[],

    '--out': string

    '<url>': string

}

/**
 * Options used during execution.
 */
export interface Options {

    /**
     * url to clone from.
     */
    url: string

    /**
     * out path to create project
     */
    out: Path

    /**
     * context to evalutate .eric files in.
     */
    context: Context

}

/**
 * args2Opts converts Arguments to an Options object.
 */
export const args2Opts = (args: Arguments): Options => ({

    url: args['<url>'],

    out: expand(process.cwd(), args['--out'] || repoName(args['<url>'])),

    context: <Context>mkContext({}, args['--set'])

});

const mkContext = (ctx: Context, sets: string[]) =>
    sets.reduce((p, c) => {

        let v = c.split('=');
        return set(v[0], v[1], p);

    }, ctx);

const repoName = (path: Path) =>
    basename(path).split('.git').join('');

const expand = (parent: Path, name: string): Path =>
    isAbsolute(name) ? name : join(parent, name);

/**
 * exec the program.
 */
export const exec = (opts: Options) =>
    clone(opts.url, opts.out, {})
        .chain(interpolate(opts));

const clone = (url: string, dest: Path, opts: git.CloneOptions): Future<void> =>
    liftP(() => git.Clone.clone(url, dest, opts).then(() => { }));

const interpolate = (opts: Options) => () =>
    listFilesRec(opts.out)
        .chain(files =>
            parallel(
                files
                    .filter(f => endsWith(f, EXT_ERIC))
                    .map(f =>
                        interp(opts.context, f)
                            .chain(() => eraseEricFile(f)))));

const interp = (ctx: Context, path: Path) =>
    readTextFile(path)
        .map(txt => polate(txt, ctx, polateOptions))
        .chain(writeEricFile(path))

const writeEricFile = (path: Path) => (contents: string) =>
    writeTextFile(path.split(EXT_ERIC).join(''), contents)

const eraseEricFile = (path: Path) => unlink(path);
