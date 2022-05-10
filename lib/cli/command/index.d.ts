import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from './options';
import { CommandController } from './controller';
/**
 * Command is an interface used to execute a function of the application using
 * the CLI parameters.
 */
export declare abstract class Command {
    controller: CommandController;
    options: Options;
    constructor(controller: CommandController, options: Options);
    /**
     * name of the command to match against what the user supplies.
     */
    abstract name: string;
    /**
     * execute this command.
     */
    abstract execute(): Future<void>;
}
/**
 * InspectCommand
 */
export declare class InspectCommand extends Command {
    name: string;
    execute(): Future<void>;
}
/**
 * GetCommand
 */
export declare class GetCommand extends Command {
    name: string;
    execute(): Future<void>;
}
