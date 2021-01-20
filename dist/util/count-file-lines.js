"use strict";
/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/count-file-lines.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/18/2021
 * Description:
 ******************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function countFileLines(filepath) {
    const content = fs_1.default.readFileSync(filepath).toString();
    return Math.max(content.split('\n').length - 1, 0);
}
exports.default = countFileLines;
