"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandController = void 0;
const future_1 = require("@quenk/noni/lib/control/monad/future");
const auto_1 = require("../../client/auto");
const prompter_1 = require("../prompter");
/**
 * CommandController is the main class used by the eric cli.
 *
 * The methods here are called by individual [[Command]] classes to execute the
 * desired functionality.
 */
class CommandController {
    /**
     * inspect dumps the contents of the context to the console.
     */
    inspect(context) {
        return (0, future_1.pure)(console.log(JSON.stringify(context)));
    }
    /**
     * get is the main command that generates a project from a template.
     */
    get(context, src, dest) {
        return (0, future_1.doFuture)(function* () {
            let client = new auto_1.AutoClient(dest, context);
            let project = yield client.fetch(src);
            let prompter = prompter_1.Prompter.create();
            yield project.prompt(prompter);
            prompter.close();
            return project.expand();
        });
    }
}
exports.CommandController = CommandController;
//# sourceMappingURL=controller.js.map