/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/count-code.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/

import day from 'dayjs';
import { DefaultLogFields } from 'simple-git/src/lib/tasks/log';
import { SimpleGit, DiffResultTextFile, DiffResultBinaryFile, ListLogLine } from 'simple-git';
import fileFilter from '../util/file-filter';

export interface CountCodeOptions<T extends Record<string, string[]> = Record<never, string[]>> {
    authors?: string[];
    since?: string;
    before?: string;
    includes?: string[];
    excludes?: string[];
    filter?: <T extends DiffResultBinaryFile | DiffResultTextFile>( diffResultFile: T ) => boolean | T;
    groups?: T;
}

export interface CountCodeResult {
    changes: number;
    insertions: number;
    deletions: number;
}

const defaultCountCodeResult: CountCodeResult = {
    changes : 0,
    insertions : 0,
    deletions : 0
};

/**
 * count code committed by specific authors.
 *
 * ```bash
 * $ git log --author="author_name" --pretty=tformat: --numstat
 * ```
 */
export default async function countCode<T extends Record<string, string[]>>(
    git: Readonly<SimpleGit>,
    options: Readonly<CountCodeOptions<T>> = {}
): Promise<{ total: CountCodeResult } & Record<keyof T, CountCodeResult>> {
    options = {
        authors : [],
        excludes : [],
        includes : [],
        since : day().subtract( 1, 'year' ).format( 'YYYY-MM-DD' ),
        before : day().add( 1, 'day' ).format( 'YYYY-MM-DD' ),
        ...options
    };

    /**
     * simple-git can generate the {@link https://github.com/steveukx/git-js/blob/main/src/lib/responses/DiffSummary.ts DiffSummary} while set `--stat` in options.
     * @see https://github.com/steveukx/git-js#api
     */
    const opts: string[] = [
        // '--pretty=tformat:',
        '--stat=99999'
    ];

    options.authors?.forEach( ( author: string ): void => {
        opts.push( `--author=${author}` );
    } );

    const output = await git.log( opts );

    const total: CountCodeResult = { ...defaultCountCodeResult };

    const groups = {} as Record<keyof T, CountCodeResult>;

    /**
     * Create items in groups
     */
    options.groups && Object.entries( options.groups ).forEach( ( item: readonly [ keyof T, readonly string[] ] ) => {
        groups[ item[ 0 ] ] = { ...defaultCountCodeResult };
    } );

    const { excludes, includes } = options;

    output.all.forEach( ( item: Readonly<DefaultLogFields & ListLogLine> ): void => {
        const { diff } = item;


        diff?.files.forEach( ( file: DiffResultBinaryFile | DiffResultTextFile ): void => {

            if( !fileFilter( file.file, excludes || [], includes || [] ) ) return;

            /**
             * only DiffResultTextFile has changes property.
             */
            if( 'changes' in file ) {

                const { changes, insertions, deletions } = file;

                total.changes += changes;
                total.insertions += insertions;
                total.deletions += deletions;

                Object.entries( options.groups ?? {} ).forEach( ( item: readonly [ string, readonly string[] ] ) => {

                    const [ name, patterns ] = item;

                    if( fileFilter( file.file, [ '*' ], patterns ) ) {
                        groups[ name ].changes += changes;
                        groups[ name ].insertions += insertions;
                        groups[ name ].deletions += deletions;
                    }
                } );
            }
        } );
    } );

    return { total, ...groups };
}
