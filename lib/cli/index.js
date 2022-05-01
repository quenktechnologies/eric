"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.runCommand = void 0;
const function_1 = require("@quenk/noni/lib/data/function");
const get_1 = require("./command/get");
const inspect_1 = require("./command/inspect");
const noop_1 = require("./command/noop");
const arguments_1 = require("./arguments");
/**
 * runCommand provides the correct command given a string value.
 */
const runCommand = (opts) => {
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
exports.runCommand = runCommand;
/**
 * main application function.
 */
const main = (args) => (0, arguments_1.toOptions)(args)
    .chain(opts => (0, exports.runCommand)(opts))
    .fork(console.error, function_1.noop);
exports.main = main;
//# sourceMappingURL=index.js.map