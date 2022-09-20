'use strict';

import number_represent from "../helpers/number_represent.ts";
import define_function from "../helpers/define_function.ts";

/** 
 * For handling duck tape rule errors.
 * @class duck_tape_rule_error
 * @extends Error
 */
export default class DuckTapeRuleError extends Error {

    // Private Fields
    #method: Function = () => { };
    #param_position: number = 0;
    #param: any = null;
    #expected_type: string[] = [];
    #actual_type: string = '';
    #rule: string = '';
    #rule_value: any = undefined;
    #param_position_representation: string = '';
    #method_definition: string = '';

    /**
     * The constructor for creating a DuckTapeRuleError.
     * @param {Function} method - The function name.
     * @param {number} param_position - The parameter index number starting at 1.
     * @param {any} param - The parameter.
     * @param {string|array} expected_type - The expected js type as a string or array of multiple string types.
     * @param {string} actual_type - The actual js type of the parameter as string.
     * @param {string} rule - The rule to validate against the parameter.
     * @param {any} rule_value - The rule value to validate against the parameter.
     * @param {boolean} rule_not_found - Whether the rule was found.
     */
    constructor(method: Function, param_position: number, param: any, expected_type: string[], actual_type: string, rule: string, rule_value: any, rule_not_found: boolean = false) {

        super();

        // Set private fields.
        this.#method = method;
        this.#param_position = param_position;
        this.#param = param;
        this.#expected_type = expected_type;
        this.#actual_type = actual_type;
        this.#rule = rule;
        this.#rule_value = rule_value;

        this.#param_position_representation = number_represent(this.#param_position);
        this.#method_definition = define_function(this.#method, this.#param_position, this.#expected_type);

        if(rule_not_found) {

            this.message = `No duck tape rule found for ${this.#param_position_representation} parameter (Missing Rule: ${this.#rule})! in \n${this.#method_definition}`;
            return;

        } 

        this.message = `Incorrect ${this.#param_position_representation} parameter value (Rule: ${this.#rule})! in \n${this.#method_definition}!`;

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