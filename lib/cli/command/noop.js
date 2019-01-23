"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("@quenk/noni/lib/data/function");
const future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * Noop command.
 */
class Noop {
    run() {
        console.warn(`Noop#run: This command should never be ran!`);
        return future_1.pure(function_1.noop());
    }
}
exports.Noop = Noop;
//# sourceMappingURL=noop.js.map