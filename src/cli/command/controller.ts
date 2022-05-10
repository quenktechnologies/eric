import {
    Future,
    pure,
    doFuture
} from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';

import { AutoClient } from '../../client/auto';
import { Url } from '../../client';
import { Project } from '../../project';

import { Context } from '../../project/context';
import { Prompter } from '../prompter';

/**
 * CommandController is the main class used by the eric cli.
 *
 * The methods here are called by individual [[Command]] classes to execute the
 * desired functionality.
 */
export class CommandController {

    /**
     * inspect dumps the contents of the context to the console. 
     */
    inspect(context: Context): Future<void> {

        return pure(console.log(JSON.stringify(context)));

    }

    /**
     * get is the main command that generates a project from a template.
     */
    get(context: Context, src: Url, dest: Path): Future<void> {

        return doFuture(function*() {

            let client = new AutoClient(dest, context);

            let project: Project = yield client.fetch(src);

            let prompter = Prompter.create();

            yield project.prompt(prompter);

            prompter.close();

            return project.expand();

        });

    }

}
