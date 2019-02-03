/** 
 * Copyright (C) 2018 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

export class NotAuthorizedError extends Error {
    constructor(m:string){
        super(m);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }
}
export class ForbiddenError extends Error {
    constructor(m:string){
        super(m);
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
}