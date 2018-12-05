#! /usr/bin/env node
import * as docopt from 'docopt';
import { Arguments, Options, args2Opts, exec } from './cli';
import { basename } from 'path';

const BIN = basename(__filename);

const opts: Options = args2Opts(docopt.docopt<Arguments>(`

Usage:
  ${BIN} [--out=PATH] [--set=PAIR...] <url>

Options:
  -h --help          Show this screen.
  --out PATH         Path to initialize the project to.
  --set PAIR         Set a value in the context.
  --version          Show version.
`, {
        version: require('../package.json').version
    }));

const main = () => exec(opts).fork(console.error, () => { });

main();
