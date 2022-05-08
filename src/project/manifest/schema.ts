import * as os from 'os';
import * as numbers from '@quenk/preconditions/lib/number';
import * as booleans from '@quenk/preconditions/lib/boolean';
import * as strings from '@quenk/preconditions/lib/string';
import * as pre from '@quenk/preconditions';
import * as records from '@quenk/preconditions/lib/record';
import * as arrays from '@quenk/preconditions/lib/array';

import { Value, Object } from '@quenk/noni/lib/data/jsonx';
import { merge, reduce } from '@quenk/noni/lib/data/record';
import {
    doFuture,
    Future,
    pure,
    raise
} from '@quenk/noni/lib/control/monad/future';
import { Path, readJSONXFile } from '@quenk/noni/lib/io/file';

import { Failure } from '@quenk/preconditions/lib/result/failure';

import { BaseType, EnumType, Manifest } from '.';

const baseType: pre.Preconditions<Value, Value> = {

    optional: pre.optional(booleans.isBoolean),

    prompt: pre.optional(strings.isString),

    default: pre.optional(pre.or(numbers.isNumber,
        pre.or<Value, Value>(booleans.isBoolean, strings.isString)))

}

const numberType: pre.Preconditions<Value, Value> =
    merge(baseType, { type: pre.eq('number') })

const booleanType: pre.Preconditions<Value, Value> =
    merge(baseType, { type: pre.eq('boolean') });

const stringType: pre.Preconditions<Value, Value> =
    merge(baseType, { type: pre.eq('string') });

const enumType: pre.Preconditions<Value, Value> = merge(baseType, {

    type: pre.eq('enum'),

    values: arrays.map<Value, Value>(pre.or(numbers.isNumber,
        pre.or<Value, Value>(booleans.isBoolean, strings.isString)))

});

const manifestType: pre.Preconditions<Value,Value> = {

    name: strings.isString,

    context: <pre.Precondition<Value, Value>>records.map<Object, Value, Object>(
        pre.or<Object, Object>(records.restrict(numberType),
            pre.or(records.restrict(booleanType),
                pre.or(records.restrict(stringType),
                    records.restrict(enumType)))))

}

/**
 * validate a potential manifest file for errors.
 */
export const validate: pre.Precondition<Value, Manifest> =
    <pre.Precondition<Value, Manifest>>records.restrict(manifestType);

const errorTemplates = {

    'string': '{key} must be a string',

    'number': '{key} must be a number',

    'boolean': '{key} is a boolean value',

    'required': '{key} is required'

}

/**
 * failure2Error converts a Failure to an Error.
 */
export const failure2Error = (result: Failure<Value>) => {

    let msgs = <Record<string, string>>result.explain(errorTemplates);

    let lines = reduce(msgs, <string[]>[],
        (all, msg: string) => all.concat(msg));

    return new Error([
        'Encountered errors parsing the project manifest file:',
        ...lines
    ].join(os.EOL))

}

/**
 * validateManifest found in the directory specified.
 */
export const validateManifest = (dest: Path): Future<Manifest> =>
    doFuture(function*() {

        let json = yield readJSONXFile(`${dest}/eric.json`);

        let emanifest = validate(json);

        if (emanifest.isLeft())
            return raise(failure2Error(emanifest.takeLeft()));

        return pure(emanifest.takeRight());

    })

const validators: pre.Preconditions<Value, Value> = {

    number: numbers.isNumber,

    boolean: booleans.isBoolean,

    string: strings.isString,

}

/**
 * getTypeValidator provides a validator for values of the provided type 
 * specifier.
 */
export const getTypeValidator =
    (typ: BaseType): pre.Precondition<Value, Value> => (typ.type === 'enum') ?
        pre.isin<Value>((<EnumType>typ).values) :
        validators[typ.type];
