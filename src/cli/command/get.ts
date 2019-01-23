import * as git from 'nodegit';
import { join } from 'path';
import {
    Path,
    listFilesRec,
    readTextFile,
    writeTextFile,
    unlink,
    exists
} from '@quenk/noni/lib/io/file';
import { DoFn, doN } from '@quenk/noni/lib/control/monad';
import { endsWith } from '@quenk/noni/lib/data/string';
import { noop } from '@quenk/noni/lib/data/function';
import {
    Future,
    pure,
    parallel,
    liftP
} from '@quenk/noni/lib/control/monad/future';
import { polate } from '@quenk/polate';
import { Context, Options } from '../options';

export const EXT_ERIC = '.eric';
export const FILE_GIT = '.git';
export const FILE_ERIC_JSON = 'eric.json';

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

      const opts = this.options;

        return doN(<DoFn<void, Future<void>>>function* () {

            yield clone(opts.url, opts.out, {});

            const files: Path[] = yield listFilesRec(opts.out);
            const erics = files.filter(f => endsWith(f, EXT_ERIC));

            yield parallel(erics.map(f => inter(opts.context, f)
                .chain(() => unlink(f))));

            return cleanup(opts.out);

        });

    }

}

const clone = (url: string, dest: Path, opts: git.CloneOptions): Future<void> =>
    liftP(() => git.Clone.clone(url, dest, opts).then(() => { }));

const inter = (ctx: Context, path: Path) =>
    doN(<DoFn<void, Future<void>>>function* () {

        const txt = yield readTextFile(path);
        const contents = polate(txt, ctx, polateOptions);

        return writeTextFile(path.split(EXT_ERIC).join(''), contents);

    });

const cleanup = (path: Path) => doN(<DoFn<void, Future<void>>>function* () {

    yield unlink(join(path, FILE_GIT));

    const yes = yield exists(join(path, FILE_ERIC_JSON));

    return yes ? unlink(join(path, FILE_ERIC_JSON)) : pure(noop())

});
