/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/counting-code.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/

import { SimpleGit } from 'simple-git/promise';
import day from 'dayjs';

export interface CountingCodeOptions {
    authors?: string[];
    since?: string;
    before?: string;
    includes?: string[];
    excludes?: string[];
}

/**
 * ```bash
 * $ git log --author="author_name" --pretty=tformat: --numstat
 * ```
 */
export async function countingCode( git: SimpleGit, options: CountingCodeOptions = {} ): Promise<unknown> {
    options = {
        authors : [],
        since : day().subtract( 1, 'yearn' ).format( 'YYYY-MM-DD' ),
        before : day().add( 1, 'day' ).format( 'YYYY-MM-DD' ),
        ...options
    };

    const opts: string[] = [
        '--pretty=tformat:',
        '--numstat'
    ];

    if( options.authors.length ) {
        options.authors.forEach( ( author: string ): void => {
            opts.push( `--author="${author}"` );
        } );
    }

    const output = await git.log( opts );

    console.log( output );

    return output;
}
