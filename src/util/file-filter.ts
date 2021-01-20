/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/file-filter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/18/2021
 * Description:
 ******************************************************************/

import minimatch from 'minimatch';

export default function fileFilter<E extends readonly string[], I extends readonly string[]>(
    filepath: string,
    excludes: E,
    includes: I,
    filter?: ( filepath: string, filterResult: boolean, excludes: E, includes: I ) => boolean
): boolean {
    if( !excludes.length ) return true;

    let res = true;

    for( const pattern of excludes ) {
        if( minimatch( filepath, pattern ) ) {
            res = false;
            break;
        }
    }

    for( const pattern of includes ) {
        if( minimatch( filepath, pattern ) ) {
            res = true;
            break;
        }
    }

    return filter?.( filepath, res, excludes, includes ) ?? res;
}
