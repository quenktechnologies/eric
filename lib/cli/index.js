"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("@quenk/noni/lib/data/function");
const get_1 = require("./command/get");
const inspect_1 = require("./command/inspect");
const noop_1 = require("./command/noop");
const arguments_1 = require("./arguments");
/**
 * runCommand provides the correct command given a string value.
 */
exports.runCommand = (opts) => {
    let c = new noop_1.Noop();
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
exports.main = (args) => arguments_1.toOptions(args)
    .chain(opts => exports.runCommand(opts))
    .fork(console.error, function_1.noop);
//# sourceMappingURL=index.js.map