"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoClient = void 0;
const future_1 = require("@quenk/noni/lib/control/monad/future");
const file_1 = require("@quenk/noni/lib/io/file");
const git_1 = require("./git");
const filesystem_1 = require("./filesystem");
/**
 * AutoClient tries all the other clients in succession until one works.
 */
class AutoClient {
    constructor(dest, context) {
        this.dest = dest;
        this.context = context;
    }
    fetch(url) {
        let { dest, context } = this;
        return (0, future_1.doFuture)(function* () {
            let yes = yield (0, file_1.isDirectory)(url);
            if (yes)
                return (new filesystem_1.FileSystemClient(dest, context)).fetch(url);
            return (new git_1.GitClient({ dest }, context)).fetch(url);
        });
    }
}
exports.AutoClient = AutoClient;
//# sourceMappingURL=auto.js.map