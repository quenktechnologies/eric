import { Future } from '@quenk/noni/lib/control/monad/future';
import { noop } from '@quenk/noni/lib/data/function';
import { Get } from './command/get';
import { Inspect } from './command/inspect';
import { Noop } from './command/noop';
import { Command } from './command';
import { Options } from './options';
import { Arguments, toOptions } from './arguments';

/**
 * runCommand provides the correct command given a string value.
 */
export const runCommand = (opts: Options): Future<void> => {

    let c: Command = new Noop();

    switch (opts.command) {

        case 'get':
            c = new Get(opts);
            break;

        case 'inspect':
            c = new Inspect(opts);
            break;

    }

    return c.run();

}

/**
 * main application function.
 */
export const main = (args: Arguments) =>
    toOptions(args)
        .chain(opts => runCommand(opts))
        .fork(console.error, noop);
