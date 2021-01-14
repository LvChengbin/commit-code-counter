"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/counting-code.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countingCode = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
/**
 * ```bash
 * $ git log --author="author_name" --pretty=tformat: --numstat
 * ```
 */
async function countingCode(git, options = {}) {
    options = {
        authors: [],
        since: dayjs_1.default().subtract(1, 'year').format('YYYY-MM-DD'),
        before: dayjs_1.default().add(1, 'day').format('YYYY-MM-DD'),
        ...options
    };
    const opts = [
        '--pretty=tformat:',
        '--numstat'
    ];
    if (options.authors?.length) {
        options.authors.forEach((author) => {
            opts.push(`--author="${author}"`);
        });
    }
    const output = await git.log(opts);
    console.log(output);
    return output;
}
exports.countingCode = countingCode;
