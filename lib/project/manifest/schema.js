"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateManifest = exports.failure2Error = exports.validate = void 0;
const os = require("os");
const numbers = require("@quenk/preconditions/lib/number");
const booleans = require("@quenk/preconditions/lib/boolean");
const strings = require("@quenk/preconditions/lib/string");
const pre = require("@quenk/preconditions");
const records = require("@quenk/preconditions/lib/record");
const arrays = require("@quenk/preconditions/lib/array");
const record_1 = require("@quenk/noni/lib/data/record");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const file_1 = require("@quenk/noni/lib/io/file");
const baseType = {
    optional: pre.optional(booleans.isBoolean),
    prompt: pre.optional(strings.isString),
    default: pre.optional(pre.or(numbers.isNumber, pre.or(booleans.isBoolean, strings.isString)))
};
const numberType = (0, record_1.merge)(baseType, { type: pre.eq('number') });
const booleanType = (0, record_1.merge)(baseType, { type: pre.eq('boolean') });
const stringType = (0, record_1.merge)(baseType, { type: pre.eq('string') });
const enumType = (0, record_1.merge)(baseType, {
    type: pre.eq('enum'),
    values: pre.every(arrays.isArray, arrays.map(pre.or(numbers.isNumber, pre.or(booleans.isBoolean, strings.isString))))
});
const manifestType = {
    name: strings.isString,
    context: pre.every(records.isRecord, records.map(pre.anyOf(records.restrict(numberType), records.restrict(booleanType), records.restrict(stringType), records.restrict(enumType))))
};
/**
 * validate a potential manifest file for errors.
 */
exports.validate = records.restrict(manifestType);
const errorTemplates = {
    'isString': '{key} must be a string',
    'isNumber': '{key} must be a number',
    'isBoolean': '{key} is a boolean value',
    'required': '{key} is required',
    'eq': '{key} is not one of number,boolean,string or enum'
};
/**
 * failure2Error converts a Failure to an Error.
 */
const failure2Error = (result) => {
    let msgs = result.explain(errorTemplates);
    return new Error([
        'Encountered errors parsing the project manifest file:',
        JSON.stringify(msgs)
    ].join(os.EOL));
};
exports.failure2Error = failure2Error;
/**
 * validateManifest found in the directory specified.
 */
const validateManifest = (dest) => (0, future_1.doFuture)(function* () {
    let json = yield (0, file_1.readJSONXFile)(`${dest}/eric.json`);
    let emanifest = (0, exports.validate)(json);
    if (emanifest.isLeft())
        return (0, future_1.raise)((0, exports.failure2Error)(emanifest.takeLeft()));
    return (0, future_1.pure)(emanifest.takeRight());
});
exports.validateManifest = validateManifest;
//# sourceMappingURL=schema.js.map