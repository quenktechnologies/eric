"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("@quenk/noni/lib/data/function");
var future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * Noop command.
 */
var Noop = /** @class */ (function () {
    function Noop() {
    }
    Noop.prototype.run = function () {
        console.warn("Noop#run: This command should never be ran!");
        return future_1.pure(function_1.noop());
    };
    return Noop;
}());
exports.Noop = Noop;
//# sourceMappingURL=noop.js.map