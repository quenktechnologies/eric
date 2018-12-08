import {noop} from '@quenk/noni/lib/data/function';
import {Future, pure} from '@quenk/noni/lib/control/monad/future';

/**
 * Noop command.
 */
export class Noop {

  run(): Future<void> {

    console.warn(`Noop#run: This command should never be ran!`);
    return pure(noop());

  }

}
