#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docopt = require("@quenk/docopt");
const path_1 = require("path");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const arguments_1 = require("./cli/arguments");
const controller_1 = require("./cli/command/controller");
const command_1 = require("./cli/command");
const BIN = (0, path_1.basename)(__filename);
const args = docopt.docopt(`
Tool for generating project boilerplate from git repos.

Usage:
  ${BIN} get [--set=PAIR...] [--context=PATH...] <url> <path>
  ${BIN} inspect [--context=PATH...] [--set=PAIR...] 

Options:
  -h --help          Show this screen.
  --set PAIR         Set a value in the context.
  --context PATH     Merge a JCON file at the specified path into context.
  --version          Show version.
`, {
    version: require('../package.json').version
});
const main = (args) => (0, future_1.doFuture)(function* () {
    let opts = yield (0, arguments_1.toOptions)(args);
    let ctl = new controller_1.CommandController();
    let commands = [
        new command_1.InspectCommand(ctl, opts),
        new command_1.GetCommand(ctl, opts)
    ];
    return commands.find(cmd => cmd.name === opts.command).execute();
});
main(args).fork(console.error);
//# sourceMappingURL=main.js.map