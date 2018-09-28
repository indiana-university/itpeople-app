export class NotAuthorizedError extends Error {
    constructor(m:string){
        super(m);
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }
}