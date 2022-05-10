"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommand = exports.InspectCommand = exports.Command = void 0;
/**
 * Command is an interface used to execute a function of the application using
 * the CLI parameters.
 */
class Command {
    constructor(controller, options) {
        this.controller = controller;
        this.options = options;
    }
}
exports.Command = Command;
/**
 * InspectCommand
 */
class InspectCommand extends Command {
    constructor() {
        super(...arguments);
        this.name = 'inspect';
    }
    execute() {
        return this.controller.inspect(this.options.context);
    }
}
exports.InspectCommand = InspectCommand;
/**
 * GetCommand
 */
class GetCommand extends Command {
    constructor() {
        super(...arguments);
        this.name = 'get';
    }
    execute() {
        let { context, src, dest } = this.options;
        return this.controller.get(context, src, dest);
    }
}
exports.GetCommand = GetCommand;
//# sourceMappingURL=index.js.map