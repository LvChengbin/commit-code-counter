/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: util/count-file-lines.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/18/2021
 * Description:
 ******************************************************************/

import fs from 'fs';

export default function countFileLines( filepath: string ): number {
    const content = fs.readFileSync( filepath ).toString();
    return Math.max( content.split( '\n' ).length - 1, 0 );
}
