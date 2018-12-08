import { Future } from '@quenk/noni/lib/control/monad/future';
import { Options } from './options';
import { Arguments } from './arguments';
/**
 * runCommand provides the correct command given a string value.
 */
export declare const runCommand: (opts: Options) => Future<void>;
/**
 * main application function.
 */
export declare const main: (args: Arguments) => import("@quenk/noni/lib/control/monad/future").Compute<void>;
