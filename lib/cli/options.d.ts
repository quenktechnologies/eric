import { Path } from '@quenk/noni/lib/io/file';
import { Object } from '@quenk/noni/lib/data/json';
/**
 * Context eric files are expanded in .
 */
export declare type Context = Object;
/**
 * Options used during execution.
 */
export interface Options {
    /**
     * url to clone from.
     */
    url: string;
    /**
     * out path to create project
     */
    out: Path;
    /**
     * context to evalutate .eric files in.
     */
    context: Context;
    /**
     * command to execute.
     */
    command: string;
}
