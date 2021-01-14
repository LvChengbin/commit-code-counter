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
import { gitP, SimpleGit, SimpleGitOptions } from 'simple-git';
import { GIT_AUTHOR_NAME, GIT_AUTHOR_EMAIL } from './constants';

const prefix = 'git.contributes.';

type Diff<T, U> = T extends U ? never : T;
type RequiredExcludesKeys<T, U extends keyof T> = { [ P in Diff<keyof T, U> ]-?: NonNullable<T[ P ]> } & { [ P in U ]: T[ P ] };

interface CreateGitProjectOptions {
    projectName?: string;
    dir?: string;
    author_name?: string;
    author_email?: string;
    simpleGitOptions?: SimpleGitOptions;
}

export default async function( options: CreateGitProjectOptions = {} ): Promise<{
    dir: string;
    author_name: string;
    author_email: string;
    git: SimpleGit;
}> {

    const opts: RequiredExcludesKeys<CreateGitProjectOptions, 'simpleGitOptions'> = {
        dir : os.tmpdir(),
        projectName : prefix + uuidv1(),
        author_name : GIT_AUTHOR_NAME,
        author_email : GIT_AUTHOR_EMAIL,
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
     * while running `yarn test` by git `pre-commit` hook, environment variables will be passed to the spawned child process, so that `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL` variables will be used by the child git process and cause some undesired issues.
     */
    git.env( 'GIT_AUTHOR_NAME', GIT_AUTHOR_NAME );
    git.env( 'GIT_AUTHOR_EMAIL', GIT_AUTHOR_EMAIL );

    return { dir, author_name, author_email, git };
}
