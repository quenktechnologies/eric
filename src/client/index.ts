import { Future } from '@quenk/noni/lib/control/monad/future';
import { Path } from '@quenk/noni/lib/io/file';

import { Project } from '../project';

/**
 * Url string, can be a git url or a path on the local filesystem.
 */
export type Url = string;

/**
 * Options used during execution.
 */
export interface Options {

    /**
     * dest is the destination path to clone the repo to.
     */
    dest: Path

}

/**
 * Client is the interface used to fetch the project template from its source.
 */
export interface Client {

    /**
     * fetch the project template from its URL returning a [[Project]] instance
     * that was saved to the local filesystem.
     */
    fetch(url: Url): Future<Project>

}
