"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateManifest = void 0;
const future_1 = require("@quenk/noni/lib/control/monad/future");
const file_1 = require("@quenk/noni/lib/io/file");
const schema_1 = require("./schema");
/**
 * validateManifest found in the directory specified.
 */
const validateManifest = (dest) => (0, future_1.doFuture)(function* () {
    let json = yield (0, file_1.readJSONXFile)(`${dest}/eric.json`);
    let emanifest = (0, schema_1.validate)(json);
    if (emanifest.isLeft())
        return (0, future_1.raise)((0, schema_1.failure2Error)(emanifest.takeLeft()));
    return (0, future_1.pure)(emanifest.takeRight());
});
exports.validateManifest = validateManifest;
//# sourceMappingURL=index.js.map