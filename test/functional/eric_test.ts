import * as path from 'path';
import { assert } from '@quenk/test/lib/assert';
import {
    Future,
    toPromise,
    attempt,
    raise,
    fromCallback
} from '@quenk/noni/lib/control/monad/future';
import { listFilesRec } from '@quenk/noni/lib/io/file';
import { exec } from 'child_process';

const BIN = `${__dirname}/../../lib/main.js`;
const REPO = 'https://github.com/quenktechnologies/eric-skeleton-sample.git';
const SAMPLE_PATH = `${__dirname}/sample`;
const files = ['.editorconfig', '.gitignore', 'LICENSE.md', 'Makefile', 'README.md',
 'index.ts',   'mocha.opts', 'package.json'];

const cleanup = () => toPromise(run('rm', `-fR ${SAMPLE_PATH}`))

const run =
    (bin: string, args: string): Future<string> => fromCallback(cb =>
        exec(`${bin} ${args} `, (err, text, etext) => {

            if (etext)
                console.error(text, etext);

            if (err)
                return cb(err);

            cb(undefined, text);

        }));

describe('eric', () => {

    it('should clone repos', () =>
        toPromise(run(BIN, `get ${REPO} --out ${SAMPLE_PATH}`)
            .chain(() =>
                listFilesRec(SAMPLE_PATH)
                    .chain(list => attempt(() => {

                        assert(list.map(f => path.basename(f)).sort())
                            .equate(files);

                    }))))
            .then(cleanup)
            .catch(e => cleanup().then(() => toPromise(raise(e)))));

});
