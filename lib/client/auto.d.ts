import { Future } from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';
import { Context } from '../project/context';
import { Project } from '../project';
import { Client, Url } from './';
/**
 * AutoClient tries all the other clients in succession until one works.
 */
export declare class AutoClient implements Client {
    dest: Path;
    context: Context;
    constructor(dest: Path, context: Context);
    fetch(url: Url): Future<Project>;
}
