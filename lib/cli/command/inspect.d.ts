import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from '../options';
/**
 * Inspect command.
 *
 * Dumps the final context to STDIN for inspection.
 */
export declare class Inspect {
    options: Options;
    constructor(options: Options);
    run(): Future<void>;
}
