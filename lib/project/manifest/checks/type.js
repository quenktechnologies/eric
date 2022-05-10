"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeValidator = exports.failure2Error = void 0;
const os = require("os");
const numbers = require("@quenk/preconditions/lib/number");
const booleans = require("@quenk/preconditions/lib/boolean");
const strings = require("@quenk/preconditions/lib/string");
const pre = require("@quenk/preconditions");
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
const validators = {
    number: numbers.toNumber,
    boolean: booleans.toBoolean,
    string: pre.and(pre.notNull, strings.toString),
};
/**
 * getTypeValidator provides a validator for values of the provided type
 * specifier.
 */
const getTypeValidator = (typ) => (typ.type === 'enum') ?
    pre.isin(typ.values) :
    validators[typ.type];
exports.getTypeValidator = getTypeValidator;
//# sourceMappingURL=type.js.map