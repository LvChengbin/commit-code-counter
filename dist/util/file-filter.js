"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/file-filter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/18/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch_1 = __importDefault(require("minimatch"));
function fileFilter(filepath, excludes, includes, filter) {
    if (!excludes.length)
        return true;
    let res = true;
    for (const pattern of excludes) {
        if (minimatch_1.default(filepath, pattern)) {
            res = false;
            break;
        }
    }
    for (const pattern of includes) {
        if (minimatch_1.default(filepath, pattern)) {
            res = true;
            break;
        }
    }
    return filter?.(filepath, res, excludes, includes) ?? res;
}
exports.default = fileFilter;
