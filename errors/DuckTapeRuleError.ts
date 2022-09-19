'use strict';

/** 
 * For handling duck tape rule errors.
 * @class duck_tape_rule_error
 * @extends Error
 */
export class DuckTapeRuleError extends Error {

    #rule = '';

    constructor(message: string, rule: string) {

        super(message);
        this.#rule = rule;

    }

    // The name of the error. 
    get name() {

        return this.constructor.name;

    }

    // The rule that failed.
    get rule() {

        return this.#rule;

    }

}