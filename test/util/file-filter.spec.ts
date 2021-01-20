/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/file-filter.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/18/2021
 * Description:
 ******************************************************************/

import fileFilter from '../../src/util/file-filter';

describe( 'util/file-filter', () => {
    it( 'should be excluded', () => {
        const res = fileFilter( 'stray-birds.md', [ '*.md' ], [] );
        expect( res ).toBeFalsy();
    } );

    it( 'should not be excluded', () => {
        const res = fileFilter( 'stray-birds.md', [], [] );
        expect( res ).toBeTruthy();
    } );

    it( 'should no be excluded if the file matches any pattern in the includes list', () => {
        const res = fileFilter( 'stray-birds.md', [ '*.md' ], [ 'stray-birds.*' ] );
        expect( res ).toBeTruthy();
    } );

    it( 'should pass correct arguments to the filter function', () => {
        const filter = jest.fn();
        const filepath = 'stray-birds.md';
        const excludes = [ '*.md' ];
        const includes = [ 'stray-birds.*' ];
        fileFilter( filepath, excludes, includes, filter );
        expect( filter ).toHaveBeenCalledWith( filepath, true, excludes, includes );
    } );

    it( 'should use the return value of filter function', () => {
        const filepath = 'stray-birds.md';
        const excludes = [ '*.md' ];
        const includes = [ 'stray-birds.*' ];
        expect( fileFilter( filepath, excludes, includes, () => true ) ).toBeTruthy();
        expect( fileFilter( filepath, excludes, includes, () => false ) ).toBeFalsy();
    } );
} );
