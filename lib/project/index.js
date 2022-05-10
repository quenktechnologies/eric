"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const prop = require("@quenk/noni/lib/data/record/path");
const path_1 = require("path");
const record_1 = require("@quenk/noni/lib/data/record");
const file_1 = require("@quenk/noni/lib/io/file");
const string_1 = require("@quenk/noni/lib/data/string");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const type_1 = require("./manifest/checks/type");
/**
 * Project represents a successfully copied project template to the filesystem
 * that can later be expanded.
 */
class Project {
    constructor(path, manifest, context) {
        this.path = path;
        this.manifest = manifest;
        this.context = context;
    }
    /**
     * create a new Project instance.
     *
     * This method clones the [[Context]] to avoid unintended side-effects.
     */
    static create(path, manifest, context) {
        context = (0, record_1.clone)(context);
        return new Project(path, manifest, context);
    }
    /**
     * prompt using the provided [[Prompter]] for any missing context values.
     */
    prompt(prompter) {
        let that = this;
        let specs = this.manifest.context;
        let ctx = this.context;
        return (0, future_1.doFuture)(function* () {
            let missing = (0, record_1.filter)(specs, (spec, key) => {
                let val = prop.unsafeGet(key, ctx);
                if (val == null)
                    return true;
                let eresult = (0, type_1.getTypeValidator)(spec)(val);
                if (eresult.isRight()) {
                    ctx = prop.set(key, eresult.takeRight(), ctx);
                    return false;
                }
                else {
                    return true;
                }
            });
            for (let [key, spec] of Object.entries(missing)) {
                let val = prop.unsafeGet(key, ctx);
                let validator = (0, type_1.getTypeValidator)(spec);
                val = yield prompter.prompt(getPrompt(key, spec), validator, spec.default);
                ctx = prop.set(key, val, ctx);
            }
            that.context = ctx;
            return future_1.voidPure;
        });
    }
    /**
     * expand the template files in the project.
     */
    expand() {
        let { path, context } = this;
        return (0, future_1.doFuture)(function* () {
            let files = yield (0, file_1.listFilesRec)(path);
            let ericFiles = files.filter(file => (0, string_1.endsWith)(file, '.eric'));
            yield (0, future_1.parallel)(ericFiles.map(file => (0, future_1.doFuture)(function* () {
                yield inter(context, file);
                return (0, file_1.unlink)(file);
            })));
            yield (0, file_1.unlink)((0, path_1.join)(path, '.git'));
            return (0, file_1.unlink)((0, path_1.join)(path, 'eric.json'));
        });
    }
}
exports.Project = Project;
const getPrompt = (path, typ) => {
    if (typ.prompt)
        return typ.prompt;
    let defaults = typ.default ? `[ ${typ.default}]` : '';
    let values = (typ.type === 'enum') ? ` (${typ.values})` : '';
    return `Specify value for path "${path}" of ${typ.type}${values}${defaults}`;
};
const polateOptions = {
    start: '{{{',
    end: '}}}',
    regex: '(.+)'
};
const inter = (ctx, path) => (0, future_1.doFuture)(function* () {
    let txt = yield (0, file_1.readTextFile)(path);
    let contents = (0, string_1.interpolate)(txt, ctx, polateOptions);
    return (0, file_1.writeTextFile)(path.split('.eric').join(''), contents);
});
//# sourceMappingURL=index.js.map