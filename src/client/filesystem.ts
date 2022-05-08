import * as path from 'path';

import {
    Future,
    pure,
    doFuture,
} from '@quenk/noni/lib/control/monad/future';
import { Path, copy } from '@quenk/noni/lib/io/file';

import { validateManifest } from '../project/manifest';
import { Context } from '../project/context';
import { Project } from '../project';
import { Client } from '.';

/**
 * FileSystemClient fetches the project template from a path on the local
 * file system.
 *
 * @param dest - The destination path to copy the template to.
 */
export class FileSystemClient implements Client {

    constructor(public dest: Path, public context: Context) { }

    fetch(src: Path): Future<Project> {

        let dest = path.resolve(this.dest);

      let context = this.context;

        return doFuture(function*() {

            yield copy(src, dest);

            let manifest = yield validateManifest(dest);

            return pure(new Project(dest, manifest, context));

        });

    }

}
