import * as readline from 'readline';
import * as os from 'os';

import { Value } from '@quenk/noni/lib/data/jsonx';

import {
    Future,
    doFuture,
    pure,
    fromCallback
} from '@quenk/noni/lib/control/monad/future';
import { Precondition } from '@quenk/preconditions';

/**
 * Prompter used to prompt on the CLI.
 */
export class Prompter {

    constructor(public iface: readline.ReadLine) { }

    /**
     * create a new Prompter instance using STDIN and STDOUT streams.
     */
    static create() {

        return new Prompter(readline.createInterface({

            input: process.stdin,

            output: process.stdout,

            prompt: 'eric>'

        }));

    }

    /**
     * prompt the user to input a value until it passes the supplied validator.
     */
    prompt(
        msg: string,
        validator: Precondition<Value, Value>,
        defaults?: Value): Future<Value> {

        let { iface } = this;

        return doFuture(function*() {

            while (true) {

                let val = yield fromCallback(cb =>
                    iface.question(`${msg}${os.EOL}`, str => cb(null, str)));

                let result = validator(val);

                if (result.isRight()) {

                    return pure(result.takeRight());

                } else if (((val == null) || (val == '')) &&
                  (defaults != null)) {
                    return pure(defaults);

                }

            }

        });

    }

    close() {

        this.iface.close();

    }

}
