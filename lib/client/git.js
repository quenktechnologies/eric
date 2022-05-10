"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitClient = void 0;
const path = require("path");
const git = require("nodegit");
const file_1 = require("@quenk/noni/lib/io/file");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const manifest_1 = require("../project/manifest");
const project_1 = require("../project");
/**
 * GitClient uses nodegit to clone a repo containing a project template.
 */
class GitClient {
    constructor(options, context) {
        this.options = options;
        this.context = context;
    }
    fetch(url) {
        let opts = this.options;
        let dest = path.resolve(opts.dest);
        let context = this.context;
        return (0, future_1.doFuture)(function* () {
            //XXX: @types/node-git is outdated
            yield (0, future_1.liftP)(() => git.Clone.clone(url, dest, {
                certificateCheck: (process.platform === 'darwin') ?
                    () => 0 : undefined,
                callbacks: {
                    credentials: (_, username) => git.Cred.sshKeyFromAgent(username)
                }
            }));
            yield (0, file_1.unlink)(`${dest}/.git`);
            let manifest = yield (0, manifest_1.validateManifest)(dest);
            return (0, future_1.pure)(new project_1.Project(dest, manifest, context));
        });
    }
}
exports.GitClient = GitClient;
//# sourceMappingURL=git.js.map