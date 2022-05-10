"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const numbers = require("@quenk/preconditions/lib/number");
const booleans = require("@quenk/preconditions/lib/boolean");
const strings = require("@quenk/preconditions/lib/string");
const pre = require("@quenk/preconditions");
const records = require("@quenk/preconditions/lib/record");
const arrays = require("@quenk/preconditions/lib/array");
const numberType = {
    type: pre.eq('number'),
    optional: pre.optional(booleans.isBoolean),
    prompt: pre.optional(strings.isString)
};
const booleanType = {
    type: pre.eq('boolean'),
    optional: pre.optional(booleans.isBoolean),
    prompt: pre.optional(strings.isString)
};
const stringType = {
    type: pre.eq('string'),
    optional: pre.optional(booleans.isBoolean),
    prompt: pre.optional(strings.isString)
};
const enumType = {
    type: pre.eq('enum'),
    optional: pre.optional(booleans.isBoolean),
    prompt: pre.optional(strings.isString),
    values: pre.and(arrays.isArray, arrays.map(pre.or(numbers.isNumber, pre.or(booleans.isBoolean, strings.isString))))
};
const rules = {
    name: strings.isString,
    context: pre.and(records.isRecord, records.map(pre.anyOf(records.restrict(numberType), records.restrict(booleanType), records.restrict(stringType), records.restrict(enumType))))
};
exports.validate = records.restrict(rules);
//# sourceMappingURL=validation.js.map