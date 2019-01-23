"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * Inspect command.
 *
 * Dumps the final context to STDIN for inspection.
 */
class Inspect {
    constructor(options) {
        this.options = options;
    }
    run() {
        return future_1.pure(console.log(JSON.stringify(this.options.context)));
    }
}
exports.Inspect = Inspect;
//# sourceMappingURL=inspect.js.map