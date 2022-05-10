import { Future } from '@quenk/noni/lib/control/monad/future';
import { Context } from '../project/context';
import { Project } from '../project';
import { Client, Options, Url } from '.';
/**
 * GitClient uses nodegit to clone a repo containing a project template.
 */
export declare class GitClient implements Client {
    options: Options;
    context: Context;
    constructor(options: Options, context: Context);
    fetch(url: Url): Future<Project>;
}
