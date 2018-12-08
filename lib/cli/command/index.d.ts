import { Future } from '@quenk/noni/lib/control/monad/future';
/**
 * Command
 */
export interface Command {
    /**
     * run the command.
     */
    run(): Future<void>;
}
