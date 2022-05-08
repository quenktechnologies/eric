import * as prop from '@quenk/noni/lib/data/record/path';

import { join } from 'path';

import { clone, filter } from '@quenk/noni/lib/data/record';
import { listFilesRec, Path, readTextFile, unlink, writeTextFile } from '@quenk/noni/lib/io/file';
import {
    Future,
    doFuture,
    voidPure,
    parallel
} from '@quenk/noni/lib/control/monad/future';

import { getTypeValidator } from './manifest/schema';
import { Context } from '../project/context';
import { Prompter } from '../cli/prompter';
import { BaseType, Manifest } from './manifest';
import { endsWith } from '@quenk/noni/lib/data/string';
import { polate } from '@quenk/polate';

/**
 * Project represents a successfully copied project template to the filesystem
 * that can later be expanded.
 */
export class Project {

    constructor(
        public path: Path,
        public manifest: Manifest,
        public context: Context) { }

    /**
     * create a new Project instance.
     *
     * This method clones the [[Context]] to avoid unintended side-effects.
     */
    static create(path: Path, manifest: Manifest, context: Context): Project {

        context = clone(context);

        return new Project(path, manifest, context);

    }

    /**
     * prompt using the provided [[Prompter]] for any missing context values.
     */
    prompt(prompter: Prompter): Future<void> {

        let that = this;

        let specs = this.manifest.context;

        let ctx = this.context;

        return doFuture(function*() {

            let missing = filter(specs, (spec, key) => {

                let val = prop.unsafeGet(key, ctx);

                if (val == null) return true;

                let eresult = getTypeValidator(spec)(val);

                if (eresult.isRight()) {

                    ctx = prop.set(key, eresult.takeRight(), ctx);

                    return false;

                } else {

                    return true;

                }

            });

            for (let [key, spec] of Object.entries(missing)) {

                let val = prop.unsafeGet(key, ctx);

                let validator = getTypeValidator(spec);

                val = yield prompter.prompt(getPrompt(key, spec),
                    validator, spec.default);

                ctx = prop.set(key, val, ctx);

            }

            that.context = ctx;

            return voidPure;

        });

    }

  /**
   * expand the template files in the project.
   */
    expand() {

        let { path, context } = this;

        return doFuture(function*() {

            let files: Path[] = yield listFilesRec(path);

            let ericFiles = files.filter(file => endsWith(file, '.eric'));

            yield parallel(ericFiles.map(file => doFuture(function*() {

                yield inter(context, file);

                return unlink(file);

            })));

            yield unlink(join(path, '.git'));

            return unlink(join(path, 'eric.json'));

        });

    }

}

const getPrompt = (path: string, typ: BaseType) => {

    if (typ.prompt) return typ.prompt;

    let defaults = typ.default ? `[ ${typ.default}]` : '';

    let values = (typ.type === 'enum') ? ` (${typ.values})` : ''

    return `Specify value for path "${path}" of ${typ.type}${values}${defaults}`;

}

const polateOptions = {

    start: '{{{',
    end: '}}}',
    regex: '(.+)'

}

const inter = (ctx: Context, path: Path) => doFuture(function*() {

    let txt = yield readTextFile(path);

    let contents = polate(txt, ctx, polateOptions);

    return writeTextFile(path.split('.eric').join(''), contents);

});
