#! /usr/bin/env node
import * as docopt from '@quenk/docopt';

import { basename } from 'path';

import { doFuture } from '@quenk/noni/lib/control/monad/future';

import { Arguments, toOptions } from './cli/arguments';
import { CommandController } from './cli/command/controller';
import { Command, GetCommand, InspectCommand } from './cli/command';

const BIN = basename(__filename);

const args: Arguments = docopt.docopt<Arguments>(`
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

const main = (args: Arguments) => doFuture(function*() {

    let opts = yield toOptions(args);

  let ctl = new CommandController();

  let commands = [ 
  new InspectCommand(ctl,opts), 
    new GetCommand(ctl, opts)
];

  return (<Command>commands.find(cmd => cmd.name === opts.command)).execute();

});

main(args).fork();
