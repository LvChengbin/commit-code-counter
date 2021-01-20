"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/authors.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
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
async function authors(git, options = {}) {
    options = {
        /**
         * get logs in the past year as default.
         */
        since: dayjs_1.default().subtract(1, 'year').format('YYYY-MM-DD'),
        before: dayjs_1.default().add(1, 'day').format('YYYY-MM-DD'),
        ...options
    };
    const res = [];
    const tmp = {};
    const output = await git.log([
        // '--pretty="%aN %ae"', // simple-git can parse git log automatically
        `--since=${options.since}`,
        `--before=${options.before}`
    ]);
    output.all.forEach((item) => {
        const { author_name, author_email } = item;
        const key = [author_name, author_email].join('_###_');
        if (!Object.prototype.hasOwnProperty.call(tmp, key)) {
            res.push({ author_name, author_email });
            tmp[key] = true;
        }
    });
    return res;
}
exports.default = authors;
