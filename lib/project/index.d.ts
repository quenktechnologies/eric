import { Path } from '@quenk/noni/lib/io/file';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Context } from '../project/context';
import { Prompter } from '../cli/prompter';
import { Manifest } from './manifest';
/**
 * Project represents a successfully copied project template to the filesystem
 * that can later be expanded.
 */
export declare class Project {
    path: Path;
    manifest: Manifest;
    context: Context;
    constructor(path: Path, manifest: Manifest, context: Context);
    /**
     * create a new Project instance.
     *
     * This method clones the [[Context]] to avoid unintended side-effects.
     */
    static create(path: Path, manifest: Manifest, context: Context): Project;
    /**
     * prompt using the provided [[Prompter]] for any missing context values.
     */
    prompt(prompter: Prompter): Future<void>;
    /**
     * expand the template files in the project.
     */
    expand(): Future<void>;
}
