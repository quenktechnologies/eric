import { Future } from '@quenk/noni/lib/control/monad/future';

import { Options } from './options';
import { CommandController } from './controller';

/**
 * Command is an interface used to execute a function of the application using
 * the CLI parameters.
 */
export abstract class Command {

    constructor(
        public controller: CommandController,
        public options: Options) { }

    /**
     * name of the command to match against what the user supplies.
     */
    abstract name: string;

    /**
     * execute this command.
     */
    abstract execute(): Future<void>

}

/**
 * InspectCommand
 */
export class InspectCommand extends Command {

    name = 'inspect';

    execute() {

        return this.controller.inspect(this.options.context);

    }

}

/**
 * GetCommand
 */
export class GetCommand extends Command {

    name = 'get';

    execute() {

        let { context, src, dest } = this.options;

        return this.controller.get(context, src, dest);

    }

}
