import { Object } from '@quenk/noni/lib/data/jsonx';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from './command/options';
/**
 * Arguments passed via the cli.
 */
export interface Arguments extends Object {
    '--set': string[];
    '--context': string[];
    '<url>': string;
    '<path>': string;
}
/**
 * toOptions converts an [[Arguments]] object to an Options object.
 *
 * Defaults are included for the --context flag. If the user's home directory
 * contains an .ericrc file then we read context information from there as well.
 */
export declare const toOptions: (args: Arguments) => Future<Options>;
