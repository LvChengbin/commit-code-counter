/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/file-filter.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/18/2021
 * Description:
 ******************************************************************/
export default function fileFilter<E extends readonly string[], I extends readonly string[]>(filepath: string, excludes: E, includes: I, filter?: (filepath: string, filterResult: boolean, excludes: E, includes: I) => boolean): boolean;
