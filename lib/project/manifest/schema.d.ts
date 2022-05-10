import * as pre from '@quenk/preconditions';
import { Value } from '@quenk/noni/lib/data/jsonx';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';
import { Failure } from '@quenk/preconditions/lib/result/failure';
import { Manifest } from '.';
/**
 * validate a potential manifest file for errors.
 */
export declare const validate: pre.Precondition<Value, Manifest>;
/**
 * failure2Error converts a Failure to an Error.
 */
export declare const failure2Error: (result: Failure<Value>) => Error;
/**
 * validateManifest found in the directory specified.
 */
export declare const validateManifest: (dest: Path) => Future<Manifest>;
