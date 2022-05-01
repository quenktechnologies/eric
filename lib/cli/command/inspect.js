"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inspect = void 0;
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
        return (0, future_1.pure)(console.log(JSON.stringify(this.options.context)));
    }
}
exports.Inspect = Inspect;
//# sourceMappingURL=inspect.js.map