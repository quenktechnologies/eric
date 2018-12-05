#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var docopt = require("docopt");
var cli_1 = require("./cli");
var path_1 = require("path");
var BIN = path_1.basename(__filename);
var opts = cli_1.args2Opts(docopt.docopt("\n\nUsage:\n  " + BIN + " [--out=PATH] [--set=PAIR...] <url>\n\nOptions:\n  -h --help          Show this screen.\n  --out PATH         Path to initialize the project to.\n  --set PAIR         Set a value in the context.\n  --version          Show version.\n", {
    version: require('../package.json').version
}));
var main = function () { return cli_1.exec(opts).fork(console.error, function () { }); };
main();
//# sourceMappingURL=main.js.map