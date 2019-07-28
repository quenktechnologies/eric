"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const git = require("nodegit");
const path_1 = require("path");
const file_1 = require("@quenk/noni/lib/io/file");
const monad_1 = require("@quenk/noni/lib/control/monad");
const string_1 = require("@quenk/noni/lib/data/string");
const function_1 = require("@quenk/noni/lib/data/function");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const polate_1 = require("@quenk/polate");
exports.EXT_ERIC = '.eric';
exports.FILE_GIT = '.git';
exports.FILE_ERIC_JSON = 'eric.json';
const polateOptions = {
    start: '{{{',
    end: '}}}',
    regex: '(.+)'
};
const fetchOpts = {
    callbacks: {
        credentials: (_, username) => git.Cred.sshKeyFromAgent(username)
    }
};
/**
 * Get command.
 *
 * Fetches a repo and processes it's .eric file to establish a new project.
 */
class Get {
    constructor(options) {
        this.options = options;
    }
    run() {
        const opts = this.options;
        return monad_1.doN(function* () {
            yield clone(opts.url, opts.out, { fetchOpts });
            const files = yield file_1.listFilesRec(opts.out);
            const erics = files.filter(f => string_1.endsWith(f, exports.EXT_ERIC));
            yield future_1.parallel(erics.map(f => inter(opts.context, f)
                .chain(() => file_1.unlink(f))));
            return cleanup(opts.out);
        });
    }
}
exports.Get = Get;
const clone = (url, dest, opts) => future_1.liftP(() => git.Clone.clone(url, dest, opts).then(() => { }));
const inter = (ctx, path) => monad_1.doN(function* () {
    const txt = yield file_1.readTextFile(path);
    const contents = polate_1.polate(txt, ctx, polateOptions);
    return file_1.writeTextFile(path.split(exports.EXT_ERIC).join(''), contents);
});
const cleanup = (path) => monad_1.doN(function* () {
    yield file_1.unlink(path_1.join(path, exports.FILE_GIT));
    const yes = yield file_1.exists(path_1.join(path, exports.FILE_ERIC_JSON));
    return yes ? file_1.unlink(path_1.join(path, exports.FILE_ERIC_JSON)) : future_1.pure(function_1.noop());
});
//# sourceMappingURL=get.js.map