#! /usr/bin/env node
import * as docopt from '@quenk/docopt';
import { basename } from 'path';
import { Arguments } from './cli/arguments';
import { main } from './cli';

const BIN = basename(__filename);

const args: Arguments = docopt.docopt<Arguments>(`
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

main(args);
