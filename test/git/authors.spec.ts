/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 ******************************************************************/

import authors from '../../src/git/authors';
import createGitProject from '../helpers/create-git-project';

describe( 'git.authors', () => {
    it( 'should list all authors', async () => {
        const { git, author_name, author_email } = await createGitProject();
        return expect( authors( git ) ).resolves.toEqual( [ { author_name, author_email } ] );
    } );

    it( 'should deduplicate same authors', async () => {
        const { git, author_name, author_email } = await createGitProject();
        await git.commit( 'second commit' );
        await git.commit( 'third commit' );
        return expect( authors( git ) ).resolves.toEqual( [ { author_name, author_email } ] );
    } );
} );
