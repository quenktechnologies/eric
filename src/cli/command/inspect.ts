import { Future, pure } from '@quenk/noni/lib/control/monad/future';
import { Options } from '../options';

/**
 * Inspect command.
 *
 * Dumps the final context to STDIN for inspection.
 */
export class Inspect {

    constructor(public options: Options) { }

    run(): Future<void> {

        return pure(console.log(JSON.stringify(this.options.context)));

    }

}
