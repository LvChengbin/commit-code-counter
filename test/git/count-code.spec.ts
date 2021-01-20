/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/count-code.spec.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/20/2021
 * Description:
 ******************************************************************/

import fs from 'fs';
import path from 'path';
import countCode from '../../src/git/count-code';
import countFileLines from '../../src/util/count-file-lines';
import createGitProject from '../helpers/create-git-project';

describe( 'git/count-code', () => {
    it( 'should have counted the correct number for a single commit', async () => {
        const { git, author_name, firstFile } = await createGitProject();
        const n = countFileLines( firstFile );

        const { total } = await countCode( git, {
            authors : [ author_name ]
        } );

        expect( total ).toEqual( {
            changes : n,
            insertions : n,
            deletions : 0
        } );
    } );

    it( 'should have counted the correct result for multiple commits.', async () => {
        const { git, dir, author_name, firstFile } = await createGitProject();
        const n = countFileLines( firstFile );

        fs.copyFileSync( firstFile, path.join( dir, 'second-file' ) );
        await git.add( './*' );
        await git.commit( 'second commit' );

        const { total } = await countCode( git, {
            authors : [ author_name ]
        } );

        expect( total ).toEqual( {
            changes : n * 2,
            insertions : n * 2,
            deletions : 0
        } );
    } );

    it( 'should have counted commits of all given authors', async () => {
        const { git, dir, author_name, firstFile } = await createGitProject();
        const n = countFileLines( firstFile );
        const anotherAuthor = 'another-author';

        git.env( 'GIT_AUTHOR_NAME', anotherAuthor );
        git.env( 'GIT_AUTHOR_EMAIL', 'another-author@example.com' );
        fs.copyFileSync( firstFile, path.join( dir, 'second-file' ) );
        await git.add( './*' );
        await git.commit( 'second commit' );

        {
            // for the default author
            const { total } = await countCode( git, {
                authors : [ author_name ]
            } );

            expect( total ).toEqual( {
                changes : n,
                insertions : n,
                deletions : 0
            } );
        }

        {
            // for the second author
            const { total } = await countCode( git, {
                authors : [ anotherAuthor ]
            } );

            expect( total ).toEqual( {
                changes : n,
                insertions : n,
                deletions : 0
            } );
        }

        {
            // for both of the two authors
            const { total } = await countCode( git, {
                authors : [ author_name, anotherAuthor ]
            } );

            expect( total ).toEqual( {
                changes : n * 2,
                insertions : n * 2,
                deletions : 0
            } );
        }
    } );

    it( 'should have counted correct deletions', async () => {
        const { git, dir, author_name, firstFile } = await createGitProject();
        const n = countFileLines( firstFile );

        fs.copyFileSync( firstFile, path.join( dir, 'second-file' ) );
        await git.add( './*' );
        await git.commit( 'second commit' );

        fs.unlinkSync( firstFile );
        await git.add( './*' );
        await git.commit( 'removed the first file' );

        const { total } = await countCode( git, {
            authors : [ author_name ]
        } );

        expect( total ).toEqual( {
            changes : n * 3,
            insertions : n * 2,
            deletions : n
        } );
    } );

    it( 'should not include files match `exclues` patterns', async () => {
        const { git, author_name, firstFile } = await createGitProject();

        const { total } = await countCode( git, {
            authors : [ author_name ],
            excludes : [ path.basename( firstFile ) ]
        } );

        expect( total ).toEqual( {
            changes : 0,
            insertions : 0,
            deletions : 0
        } );
    } );

    it( 'should generate results for each given groups', async () => {

        const { git, dir, author_name, firstFile } = await createGitProject();
        const n = countFileLines( firstFile );

        fs.copyFileSync( firstFile, path.join( dir, 'second-file' ) );
        await git.add( './*' );
        await git.commit( 'second commit' );

        const { total, a, b } = await countCode( git, {
            authors : [ author_name ],
            groups : {
                a : [ path.basename( firstFile ) ],
                b : [ 'second-file' ]
            }
        } );

        expect( total ).toEqual( {
            changes : n * 2,
            insertions : n * 2,
            deletions : 0
        } );

        expect( a ).toEqual( {
            changes : n,
            insertions : n,
            deletions : 0
        } );

        expect( b ).toEqual( {
            changes : n,
            insertions : n,
            deletions : 0
        } );
    } );
} );
