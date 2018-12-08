import * as git from 'nodegit';
import {
    Path,
    listFilesRec,
    readTextFile,
    writeTextFile,
    unlink
} from '@quenk/noni/lib/io/file';
import { endsWith } from '@quenk/noni/lib/data/string';
import { noop } from '@quenk/noni/lib/data/function';
import { Future, parallel, liftP } from '@quenk/noni/lib/control/monad/future';
import { polate } from '@quenk/polate';
import { Context, Options } from '../options';

export const EXT_ERIC = '.eric';

const polateOptions = {

    start: '{{{',
    end: '}}}',
    regex: '(.+)'

}

/**
 * Get command.
 *
 * Fetches a repo and processes it's .eric file to establish a new project.
 */
export class Get {

    constructor(public options: Options) { }

    run(): Future<void> {

        return run(this.options);

    }

}

const run = (opts: Options): Future<void> =>
    clone(opts.url, opts.out, {})
        .chain(interpolate(opts))
        .map(noop);

const clone = (url: string, dest: Path, opts: git.CloneOptions): Future<void> =>
    liftP(() => git.Clone.clone(url, dest, opts).then(() => { }));

const interpolate = (opts: Options) => () =>
    listFilesRec(opts.out)
        .chain(files =>
            parallel(
                files
                    .filter(f => endsWith(f, EXT_ERIC))
                    .map(f =>
                        inter(opts.context, f)
                            .chain(() => eraseEricFile(f)))));

const inter = (ctx: Context, path: Path) =>
    readTextFile(path)
        .map(txt => polate(txt, ctx, polateOptions))
        .chain(writeEricFile(path))

const writeEricFile = (path: Path) => (contents: string) =>
    writeTextFile(path.split(EXT_ERIC).join(''), contents);

const eraseEricFile = (path: Path) =>
    unlink(path);
