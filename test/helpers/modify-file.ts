/******************************************************************
 * Copyright (C) 2021 LvChengbin
 *
 * File: helpers/modify-file.ts
 * Author: LvChengbin<lvchengbin59@gmail.com>
 * Time: 01/15/2021
 * Description:
 ******************************************************************/

// import fs from 'fs';
import { CountCodeResult } from '../../src/git/count-code';

export interface ModifyFileOptions {
    action: 'append' | ( ( content: string ) => string );
}

export default async function ModifyFile( name: string, options: Readonly<ModifyFileOptions> = {} ): CountCodeResult {
    console.log( options );
    // fs.writeFileSync();
}
