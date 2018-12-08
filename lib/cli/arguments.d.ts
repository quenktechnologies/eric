import { Object } from '@quenk/noni/lib/data/json';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from './options';
export declare const FILE_ERICRC = ".ericrc";
export declare const EXT_ERIC = ".eric";
/**
 * commands supported.
 */
export declare const commands: string[];
/**
 * Arguments passed via the cli.
 */
export interface Arguments extends Object {
    '--set': string[];
    '--context': string[];
    '--out': string;
    '<url>': string;
}
/**
 * toOptions converts Arguments to an Options object.
 *
 * Defaults are included for the --out and --context flags.
 * If the user's home directory contains an .ericrc file
 * then we read context information from there as well.
 */
export declare const toOptions: (args: Arguments) => Future<Options>;
