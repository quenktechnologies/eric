import { Future } from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';
import { Context } from '../project/context';
import { Project } from '../project';
import { Client } from '.';
/**
 * FileSystemClient fetches the project template from a path on the local
 * file system.
 *
 * @param dest - The destination path to copy the template to.
 */
export declare class FileSystemClient implements Client {
    dest: Path;
    context: Context;
    constructor(dest: Path, context: Context);
    fetch(src: Path): Future<Project>;
}
