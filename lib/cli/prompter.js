"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompter = void 0;
const readline = require("readline");
const os = require("os");
const future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * Prompter used to prompt on the CLI.
 */
class Prompter {
    constructor(iface) {
        this.iface = iface;
    }
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
    prompt(msg, validator, defaults) {
        let { iface } = this;
        return (0, future_1.doFuture)(function* () {
            while (true) {
                let val = yield (0, future_1.fromCallback)(cb => iface.question(`${msg}${os.EOL}`, str => cb(null, str)));
                let result = validator(val);
                if (result.isRight()) {
                    return (0, future_1.pure)(result.takeRight());
                }
                else if (((val == null) || (val == '')) &&
                    (defaults != null)) {
                    return (0, future_1.pure)(defaults);
                }
            }
        });
    }
    close() {
        this.iface.close();
    }
}
exports.Prompter = Prompter;
//# sourceMappingURL=prompter.js.map