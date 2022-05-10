import * as os from 'os';
import * as numbers from '@quenk/preconditions/lib/number';
import * as booleans from '@quenk/preconditions/lib/boolean';
import * as strings from '@quenk/preconditions/lib/string';
import * as pre from '@quenk/preconditions';

import { Value } from '@quenk/noni/lib/data/jsonx';

import { Failure } from '@quenk/preconditions/lib/result/failure';

import { BaseType, EnumType } from '../';

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

const validators: pre.Preconditions<Value, Value> = {

    number: numbers.toNumber,

    boolean: booleans.toBoolean,

    string: pre.and(pre.notNull, strings.toString),

}

/**
 * getTypeValidator provides a validator for values of the provided type 
 * specifier.
 */
export const getTypeValidator =
    (typ: BaseType): pre.Precondition<Value, Value> => (typ.type === 'enum') ?
        pre.isin<Value>((<EnumType>typ).values) :
        validators[typ.type];
