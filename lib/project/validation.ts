import * as numbers from '@quenk/preconditions/lib/number';
import * as booleans from '@quenk/preconditions/lib/boolean';
import * as strings from '@quenk/preconditions/lib/string';
import * as pre from '@quenk/preconditions';
import * as records from '@quenk/preconditions/lib/record';
import * as arrays from '@quenk/preconditions/lib/array';

import { Value, Object } from '@quenk/noni/lib/data/jsonx';

const numberType: pre.Preconditions<Value, Value> = {

    type: pre.eq('number'),

    optional: pre.optional(booleans.isBoolean),

    prompt: pre.optional(strings.isString)

}

const booleanType: pre.Preconditions<Value, Value> = {

    type: pre.eq('boolean'),

    optional: pre.optional(booleans.isBoolean),

    prompt: pre.optional(strings.isString)

}

const stringType: pre.Preconditions<Value, Value> = {

    type: pre.eq('string'),

    optional: pre.optional(booleans.isBoolean),

    prompt: pre.optional(strings.isString)

}

const enumType: pre.Preconditions<Value, Value> = {

    type: pre.eq('enum'),

    optional: pre.optional(booleans.isBoolean),

    prompt: pre.optional(strings.isString),

    values: <pre.Precondition<Value, Value>>pre.and(arrays.isArray,
        arrays.map(pre.or(numbers.isNumber,
            pre.or<Value, Value>(booleans.isBoolean, strings.isString))))

}

const rules: pre.Preconditions<Value, Value> = {

    name: strings.isString,

    context: <pre.Precondition<Value, Value>>pre.and(records.isRecord, 
       records.map(
        pre.anyOf<Object, Object>(
            records.restrict(numberType),
            records.restrict(booleanType),
            records.restrict(stringType),
            records.restrict(enumType))))

}

export const validate = records.restrict(rules);
