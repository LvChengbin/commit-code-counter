"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: git/count-code.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/13/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const file_filter_1 = __importDefault(require("../util/file-filter"));
const defaultCountCodeResult = {
    changes: 0,
    insertions: 0,
    deletions: 0
};
/**
 * count code committed by specific authors.
 *
 * ```bash
 * $ git log --author="author_name" --pretty=tformat: --numstat
 * ```
 */
async function countCode(git, options = {}) {
    options = {
        authors: [],
        excludes: [],
        includes: [],
        since: dayjs_1.default().subtract(1, 'year').format('YYYY-MM-DD'),
        before: dayjs_1.default().add(1, 'day').format('YYYY-MM-DD'),
        ...options
    };
    /**
     * simple-git can generate the {@link https://github.com/steveukx/git-js/blob/main/src/lib/responses/DiffSummary.ts DiffSummary} while set `--stat` in options.
     * @see https://github.com/steveukx/git-js#api
     */
    const opts = [
        // '--pretty=tformat:',
        '--stat=99999'
    ];
    options.authors?.forEach((author) => {
        opts.push(`--author=${author}`);
    });
    const output = await git.log(opts);
    const total = { ...defaultCountCodeResult };
    const groups = {};
    /**
     * Create items in groups
     */
    options.groups && Object.entries(options.groups).forEach((item) => {
        groups[item[0]] = { ...defaultCountCodeResult };
    });
    const { excludes, includes } = options;
    output.all.forEach((item) => {
        const { diff } = item;
        diff?.files.forEach((file) => {
            if (!file_filter_1.default(file.file, excludes || [], includes || []))
                return;
            /**
             * only DiffResultTextFile has changes property.
             */
            if ('changes' in file) {
                const { changes, insertions, deletions } = file;
                total.changes += changes;
                total.insertions += insertions;
                total.deletions += deletions;
                Object.entries(options.groups ?? {}).forEach((item) => {
                    const [name, patterns] = item;
                    if (file_filter_1.default(file.file, ['*'], patterns)) {
                        groups[name].changes += changes;
                        groups[name].insertions += insertions;
                        groups[name].deletions += deletions;
                    }
                });
            }
        });
    });
    return { total, ...groups };
}
exports.default = countCode;
