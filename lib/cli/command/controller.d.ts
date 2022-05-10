import { Future } from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';
import { Url } from '../../client';
import { Context } from '../../project/context';
/**
 * CommandController is the main class used by the eric cli.
 *
 * The methods here are called by individual [[Command]] classes to execute the
 * desired functionality.
 */
export declare class CommandController {
    /**
     * inspect dumps the contents of the context to the console.
     */
    inspect(context: Context): Future<void>;
    /**
     * get is the main command that generates a project from a template.
     */
    get(context: Context, src: Url, dest: Path): Future<void>;
}
