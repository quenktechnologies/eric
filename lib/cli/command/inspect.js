"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var future_1 = require("@quenk/noni/lib/control/monad/future");
/**
 * Inspect command.
 *
 * Dumps the final context to STDIN for inspection.
 */
var Inspect = /** @class */ (function () {
    function Inspect(options) {
        this.options = options;
    }
    Inspect.prototype.run = function () {
        return future_1.pure(console.log(JSON.stringify(this.options.context)));
    };
    return Inspect;
}());
exports.Inspect = Inspect;
//# sourceMappingURL=inspect.js.map