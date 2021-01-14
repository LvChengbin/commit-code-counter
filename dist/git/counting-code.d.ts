/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/counting-code.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/
import { SimpleGit } from 'simple-git/promise';
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
export declare function countingCode(git: SimpleGit, options?: CountingCodeOptions): Promise<unknown>;
