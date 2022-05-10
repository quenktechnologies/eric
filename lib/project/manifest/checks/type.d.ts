import * as pre from '@quenk/preconditions';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Failure } from '@quenk/preconditions/lib/result/failure';
import { BaseType } from '../';
/**
 * failure2Error converts a Failure to an Error.
 */
export declare const failure2Error: (result: Failure<Value>) => Error;
/**
 * getTypeValidator provides a validator for values of the provided type
 * specifier.
 */
export declare const getTypeValidator: (typ: BaseType) => pre.Precondition<Value, Value>;
