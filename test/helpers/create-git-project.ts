/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: helpers/create-git-project.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/14/2021
 * Description:
 ******************************************************************/

import os from 'os';
import fs from 'fs';
import path from 'path';
import { v1 as uuidv1 } from 'uuid';
import { RequiredExcludesKeys } from '@ynn/utility-types';
import { gitP, SimpleGit, SimpleGitOptions } from 'simple-git';
import { GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL, GIT_DEFAULT_FIRST_COMMIT_MESSAGE } from './constants';

const prefix = 'git.contributes.';
const fixturesPath = path.resolve( __dirname, '../fixtures' );
const strayBirdsFileName = 'stray-birds.md';
const strayBirdsPath = path.join( fixturesPath, strayBirdsFileName );

interface CreateGitProjectOptions {
    projectName?: string;
    dir?: string;
    author_name?: string;
    author_email?: string;
    simpleGitOptions?: SimpleGitOptions;
    firstCommit?: boolean | string;
}

export default async function( options: Readonly<CreateGitProjectOptions> = {} ): Promise<{
    dir: string;
    author_name: string;
    author_email: string;
    git: SimpleGit;
    firstFile: string;
}> {
    const opts: RequiredExcludesKeys<CreateGitProjectOptions, 'simpleGitOptions'> = {
        dir : os.tmpdir(),
        projectName : prefix + uuidv1(),
        author_name : GIT_AUTHOR_NAME,
        author_email : GIT_AUTHOR_EMAIL,
        firstCommit : true,
        ...options
    };

    const dir = path.join( opts.dir, opts.projectName );

    fs.mkdirSync( dir );

    const git = gitP( {
        baseDir : dir,
        binary : 'git',
        maxConcurrentProcesses : 6
    } );

    const { author_name, author_email } = opts;

    await git.init();
    await git.addConfig( 'user.name', author_name );
    await git.addConfig( 'user.email', author_email );
    /**
     * while running `yarn test` by git `pre-commit` hook,
     * environment variables will be passed to the spawned child process,
     * so that `GIT_AUTHOR_NAME` and `GIT_AUTHOR_EMAIL` variables will be passed to the child git process,
     * and git will use the variable directly rather than get information from .git/config file.
     */
    git.env( 'GIT_AUTHOR_NAME', GIT_AUTHOR_NAME );
    git.env( 'GIT_AUTHOR_EMAIL', GIT_AUTHOR_EMAIL );

    const firstFile = path.join( dir, strayBirdsFileName );

    /**
     * if the firstCommit is set, copy the file to the project directory and commit the change.
     */
    if( opts.firstCommit ) {
        let commit: string = GIT_DEFAULT_FIRST_COMMIT_MESSAGE;
        if( typeof opts.firstCommit === 'string' ) {
            commit = opts.firstCommit;
        }
        fs.copyFileSync( strayBirdsPath, firstFile );
        await git.add( './*' );
        await git.commit( commit );
    }

    return { dir, author_name, author_email, git, firstFile };
}
