import { Future, doFuture } from '@quenk/noni/lib/control/monad/future';
import { isDirectory, Path } from '@quenk/noni/lib/io/file';

import { Context } from '../project/context';
import { Project } from '../project';
import { GitClient } from './git';
import { FileSystemClient } from './filesystem';
import { Client,  Url } from './';

/**
 * AutoClient tries all the other clients in succession until one works.
 */
export class AutoClient implements Client {

        constructor(public dest: Path, public context: Context) { }

    fetch(url: Url): Future<Project> {

        let { dest, context } = this;

        return doFuture(function*() {

            let yes = yield isDirectory(url);

            if (yes)
                return (new FileSystemClient(dest, context)).fetch(url);

            return (new GitClient({dest}, context)).fetch(url);

        });

    }

}
