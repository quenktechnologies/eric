"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noop = void 0;
const function_1 = require("@quenk/noni/lib/data/function");
const future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * Noop command.
 */
class Noop {
    run() {
        console.warn(`Noop#run: This command should never be ran!`);
        return (0, future_1.pure)((0, function_1.noop)());
    }
}
exports.Noop = Noop;
//# sourceMappingURL=noop.js.map