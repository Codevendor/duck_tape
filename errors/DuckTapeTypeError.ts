'use strict';

/** 
 * For handling duck tape type errors.
 * @class duck_tape_type_error
 * @extends TypeError
 */
export class DuckTapeTypeError extends TypeError {

    constructor(message: string) {

        super(message);

    }

    /** The name of the error. */
    get name() {

        return this.constructor.name;

    }

}