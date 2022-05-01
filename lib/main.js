#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docopt = require("@quenk/docopt");
const path_1 = require("path");
const cli_1 = require("./cli");
const BIN = (0, path_1.basename)(__filename);
const args = docopt.docopt(`
Tool for generating project boilerplate from git repos.

Usage:
  ${BIN} get [--out=PATH] [--set=PAIR...] [--context=PATH...] <url>
  ${BIN} inspect [--context=PATH...] [--set=PAIR...] 

Options:
  -h --help          Show this screen.
  --out PATH         Path to initialize the project to.
  --set PAIR         Set a value in the context.
  --context PATH     Merge a JCON file at the specified path into context.
  --version          Show version.
`, {
    version: require('../package.json').version
});
(0, cli_1.main)(args);
//# sourceMappingURL=main.js.map