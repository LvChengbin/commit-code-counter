/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/authors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/
import { SimpleGit } from 'simple-git/promise';
export interface AuthorsOptions {
    since?: string;
    before?: string;
}
export interface Author {
    author_name: string;
    author_email: string;
}
/**
 * list all author names of contributors.
 * the method returns the list of authors who contributed to the project in the past year of during the given time range.
 *
 * ```bash
 * $ git log --pretty="%an %ae" --since=2020-02-02 --before=2021-02-02
 * ```
 *
 * @example
 *
 * ```ts
 * authors( simpleGit(), {
 *     since : '2020-02-02',
 *     before : '2021-02-02'
 * } );
 * ```
 *
 * @param git - the SimpleGit instance
 * @param options - options for filters logs
 * @param options.since - only collect authors from logs recent than the specific date
 * @param options.before - only collect authors from logs older than the specific date
 *
 * @return a Promise object resolves with the author list.
 */
export declare function authors(git: SimpleGit, options?: Readonly<AuthorsOptions>): Promise<Author[]>;
