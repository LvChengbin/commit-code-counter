/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 ******************************************************************/

import fs from 'fs';
import path from 'path';
import { authors } from '../../src/git/authors';
import createGitProject from '../helpers/create-git-project';

const fixturesPath = path.resolve( __dirname, '../fixtures' );
const strayBirdsFileName = 'stray-birds.md';
const strayBirdsPath = path.join( fixturesPath, strayBirdsFileName );

describe( 'git.authors', () => {
    it( 'should list all authors', async () => {
        const { git, dir, author_name, author_email } = await createGitProject();

        fs.copyFileSync( strayBirdsPath, path.join( dir, strayBirdsFileName ) );
        await git.add( './*' );
        await git.commit( 'first commit' );
        const res = await authors( git );

        expect( res ).toEqual( [ { author_name, author_email } ] );
    } );

    it( 'should deduplicate same authors', async () => {

        const { git, dir, author_name, author_email } = await createGitProject();

        fs.copyFileSync( strayBirdsPath, path.join( dir, strayBirdsFileName ) );
        await git.add( './*' );
        await git.commit( 'first commit' );
        await git.commit( 'second commit' );
        await git.commit( 'third commit' );
        const res = await authors( git );

        expect( res ).toEqual( [ { author_name, author_email } ] );
    } );
} );
