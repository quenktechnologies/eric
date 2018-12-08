"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("@quenk/noni/lib/data/function");
var get_1 = require("./command/get");
var inspect_1 = require("./command/inspect");
var noop_1 = require("./command/noop");
var arguments_1 = require("./arguments");
/**
 * runCommand provides the correct command given a string value.
 */
exports.runCommand = function (opts) {
    var c = new noop_1.Noop();
    switch (opts.command) {
        case 'get':
            c = new get_1.Get(opts);
            break;
        case 'inspect':
            c = new inspect_1.Inspect(opts);
            break;
    }
    return c.run();
};
/**
 * main application function.
 */
exports.main = function (args) {
    return arguments_1.toOptions(args)
        .chain(function (opts) { return exports.runCommand(opts); })
        .fork(console.error, function_1.noop);
};
//# sourceMappingURL=index.js.map