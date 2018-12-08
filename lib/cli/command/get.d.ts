import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from '../options';
export declare const EXT_ERIC = ".eric";
/**
 * Get command.
 *
 * Fetches a repo and processes it's .eric file to establish a new project.
 */
export declare class Get {
    options: Options;
    constructor(options: Options);
    run(): Future<void>;
}
