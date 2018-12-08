#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docopt = require("docopt");
var path_1 = require("path");
var cli_1 = require("./cli");
var BIN = path_1.basename(__filename);
var args = docopt.docopt("\nTool for generating project boilerplate from git repos.\n\nUsage:\n  " + BIN + " get [--out=PATH] [--set=PAIR...] [--context=PATH...] <url>\n  " + BIN + " inspect [--context=PATH...] [--set=PAIR...] \n\nOptions:\n  -h --help          Show this screen.\n  --out PATH         Path to initialize the project to.\n  --set PAIR         Set a value in the context.\n  --context PATH     Merge a JCON file at the specified path into context.\n  --version          Show version.\n", {
    version: require('../package.json').version
});
cli_1.main(args);
//# sourceMappingURL=main.js.map