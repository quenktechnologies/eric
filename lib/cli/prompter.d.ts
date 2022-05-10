/// <reference types="node" />
import * as readline from 'readline';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Precondition } from '@quenk/preconditions';
/**
 * Prompter used to prompt on the CLI.
 */
export declare class Prompter {
    iface: readline.ReadLine;
    constructor(iface: readline.ReadLine);
    /**
     * create a new Prompter instance using STDIN and STDOUT streams.
     */
    static create(): Prompter;
    /**
     * prompt the user to input a value until it passes the supplied validator.
     */
    prompt(msg: string, validator: Precondition<Value, Value>, defaults?: Value): Future<Value>;
    close(): void;
}
