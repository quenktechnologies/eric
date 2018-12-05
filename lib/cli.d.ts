import { Path } from '@quenk/noni/lib/io/file';
import { Object } from '@quenk/noni/lib/data/json';
import { Future } from '@quenk/noni/lib/control/monad/future';
export declare const EXT_ERIC = ".eric";
export declare type Context = Object;
/**
 * Arguments passed via the cli.
 */
export interface Arguments {
    '--set': string[];
    '--out': string;
    '<url>': string;
}
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
}
/**
 * args2Opts converts Arguments to an Options object.
 */
export declare const args2Opts: (args: Arguments) => Options;
/**
 * exec the program.
 */
export declare const exec: (opts: Options) => Future<void[]>;
