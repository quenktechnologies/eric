import * as path from 'path';
import * as git from 'nodegit';

import { unlink } from '@quenk/noni/lib/io/file';
import {
    Future,
    pure,
    liftP,
    doFuture
} from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';

import { validateManifest } from '../project/manifest';
import { Context } from '../project/context';
import { Project } from '../project';
import { Client, Options, Url } from '.';

/**
 * GitClient uses nodegit to clone a repo containing a project template.
 */
export class GitClient implements Client {

    constructor(public options: Options, public context: Context) { }

    fetch(url: Url): Future<Project> {

        let opts = this.options;

        let dest = path.resolve(opts.dest);

      let context = this.context;

        return doFuture(function*() {

            //XXX: @types/node-git is outdated
            yield liftP(() => git.Clone.clone(url, dest, <Type>{

                certificateCheck: (process.platform === 'darwin') ?
                    () => 0 : undefined,

                callbacks: {

                    credentials: (_: string, username: string) =>
                        git.Cred.sshKeyFromAgent(username)

                }

            }));

            yield unlink(`${dest}/.git`);

            let manifest = yield validateManifest(dest);

            return pure(new Project(dest, manifest, context));

        });

    }

}
