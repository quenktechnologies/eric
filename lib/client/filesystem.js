"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemClient = void 0;
const path = require("path");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const file_1 = require("@quenk/noni/lib/io/file");
const manifest_1 = require("../project/manifest");
const project_1 = require("../project");
/**
 * FileSystemClient fetches the project template from a path on the local
 * file system.
 *
 * @param dest - The destination path to copy the template to.
 */
class FileSystemClient {
    constructor(dest, context) {
        this.dest = dest;
        this.context = context;
    }
    fetch(src) {
        let dest = path.resolve(this.dest);
        let context = this.context;
        return (0, future_1.doFuture)(function* () {
            yield (0, file_1.copy)(src, dest);
            let manifest = yield (0, manifest_1.validateManifest)(dest);
            return (0, future_1.pure)(new project_1.Project(dest, manifest, context));
        });
    }
}
exports.FileSystemClient = FileSystemClient;
//# sourceMappingURL=filesystem.js.map