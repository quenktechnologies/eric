import { Path } from '@quenk/noni/lib/io/file';
import { Context } from '../../project/context';
import { Url } from '../../client';
/**
 * Options used during execution.
 */
export interface Options {
    /**
     * src url to clone from.
     */
    src: Url;
    /**
     * dest path to create project
     */
    dest: Path;
    /**
     * context to evalutate .eric files in.
     */
    context: Context;
    /**
     * command to execute.
     */
    command: string;
}
