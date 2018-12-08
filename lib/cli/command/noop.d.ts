import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Noop command.
 */
export declare class Noop {
    run(): Future<void>;
}
