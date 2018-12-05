# Eric

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

![Eric Williams][eric]

A simple task runner for ambitious projects.

## Installation

```sh
npm install eric -g

```

## Usage

write task(s) -> convert to js -> run desired task(s)

Run `eric init` at the root of your project to create a new eric folder.
In this folder you will find:

  * build - This folder stores tasks converted to js code.
  * tasks - The raw task source code in eric format.
  * templates - This folder stores files used by file generators.
  
Eric has its own declarative syntax for declaring tasks, the `eric build` command turns
this syntax into javascript that you can run via `eric run <task name>`.

###Creating Tasks

A task file can contain one or more tasks. All tasks must extend
the Task class from the package [eric-types] or a class that extends that.

Eric does not automatically import types so you must declare them at the top
of your file as you would in regular ES2015+ code.

```

import <name> from <package>
import * as <name> from <package>

task <task name>:<task type> {

   <property-name> : <value>
   <method-name>(<method-arguments>)

}

```
example :

```
import * as types from 'eric-types';

task init:types.Generator {
 template: 'src/templates'
 file ('LICENSE', 'LICENSE')
}

task custom:types.Custom {

  customValud: 'custom'
  customMethod('x', 'y', 'z')

}

```
## License

Apache-2.0

[npm-image]: https://img.shields.io/npm/v/eric.svg?style=flat
[npm-url]: https://npmjs.org/package/eric
[downloads-image]: https://img.shields.io/npm/dm/eric.svg?style=flat
[downloads-url]: https://npmjs.org/package/eric
[eric]:https://raw.githubusercontent.com/metasansana/eric/master/assets/eric.jpg 
[eric-types]: https://npmjs.org/package/eric-types
