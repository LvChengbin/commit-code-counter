/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/count-code.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/
import { SimpleGit, DiffResultTextFile, DiffResultBinaryFile } from 'simple-git';
export interface CountCodeOptions<T extends Record<string, string[]> = Record<never, string[]>> {
    authors?: string[];
    since?: string;
    before?: string;
    includes?: string[];
    excludes?: string[];
    filter?: <T extends DiffResultBinaryFile | DiffResultTextFile>(diffResultFile: T) => boolean | T;
    groups?: T;
}
export interface CountCodeResult {
    changes: number;
    insertions: number;
    deletions: number;
}
/**
 * count code committed by specific authors.
 *
 * ```bash
 * $ git log --author="author_name" --pretty=tformat: --numstat
 * ```
 */
export default function countCode<T extends Record<string, string[]>>(git: Readonly<SimpleGit>, options?: Readonly<CountCodeOptions<T>>): Promise<{
    total: CountCodeResult;
} & Record<keyof T, CountCodeResult>>;
