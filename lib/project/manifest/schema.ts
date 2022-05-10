import * as os from 'os';
import * as numbers from '@quenk/preconditions/lib/number';
import * as booleans from '@quenk/preconditions/lib/boolean';
import * as strings from '@quenk/preconditions/lib/string';
import * as pre from '@quenk/preconditions';
import * as records from '@quenk/preconditions/lib/record';
import * as arrays from '@quenk/preconditions/lib/array';

import { Value, Object } from '@quenk/noni/lib/data/jsonx';
import { merge } from '@quenk/noni/lib/data/record';
import {
    doFuture,
    Future,
    pure,
    raise
} from '@quenk/noni/lib/control/monad/future';
import { Path, readJSONXFile } from '@quenk/noni/lib/io/file';

import { Failure } from '@quenk/preconditions/lib/result/failure';

import {  Manifest } from '.';

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

    values: pre.every(
        arrays.isArray,
        arrays.map<Value, Value>(pre.or(numbers.isNumber,
            pre.or<Value, Value>(booleans.isBoolean, strings.isString))))

});

const manifestType: pre.Preconditions<Value, Value> = {

    name: strings.isString,

    context: <pre.Precondition<Value, Value>>pre.every(
        records.isRecord,
        records.map<Value, Value, Object>(
            pre.anyOf<Value, Value>(
                <pre.Precondition<Value, Value>>records.restrict(numberType),
                <pre.Precondition<Value, Value>>records.restrict(booleanType),
                <pre.Precondition<Value, Value>>records.restrict(stringType),
                <pre.Precondition<Value, Value>>records.restrict(enumType)
            )))

}

/**
 * validate a potential manifest file for errors.
 */
export const validate: pre.Precondition<Value, Manifest> =
    <pre.Precondition<Value, Manifest>>records.restrict(manifestType);

const errorTemplates = {

    'isString': '{key} must be a string',

    'isNumber': '{key} must be a number',

    'isBoolean': '{key} is a boolean value',

    'required': '{key} is required',

    'eq': '{key} is not one of number,boolean,string or enum'

}

/**
 * failure2Error converts a Failure to an Error.
 */
export const failure2Error = (result: Failure<Value>) => {

    let msgs = <Record<string, string>>result.explain(errorTemplates);

    return new Error([
        'Encountered errors parsing the project manifest file:',
        JSON.stringify(msgs)
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
