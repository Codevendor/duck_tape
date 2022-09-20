'use strict';

import number_represent from "../helpers/number_represent.ts";
import define_function from "../helpers/define_function.ts";

/** 
 * For handling duck tape type errors.
 * @class duck_tape_type_error
 * @extends TypeError
 */
export default class DuckTapeTypeError extends TypeError {

    // Private fields
    #method: Function = () => { };
    #param_position: number = 0;
    #param: any = undefined;
    #expected_type: string[] = [];
    #actual_type: string = '';
    #param_position_representation: string = '';
    #method_definition: string = '';


    /**
     * The constructor for creating a DuckTapeTypeError.
     * @param {Function} method - The function name.
     * @param {number} param_position - The parameter index number starting at 1.
     * @param {any} param - The parameter.
     * @param {array} expected_type - The expected js type as array of multiple string types.
     * @param {string} actual_type - The actual js type of the parameter as string.
     */
    constructor(method: Function, param_position: number, param: any, expected_type: string[], actual_type: string) {

        super();

        // Set private fields.
        this.#method = method;
        this.#param_position = param_position;
        this.#param = param;
        this.#expected_type = expected_type;
        this.#actual_type = actual_type;

        this.#param_position_representation = number_represent(this.#param_position);
        this.#method_definition = define_function(this.#method, this.#param_position, this.#expected_type);

        this.message = `Incorrect ${this.#param_position_representation} parameter type (${this.#actual_type})! in \n${this.#method_definition}`;

    }

    // The name of the error.
    get name() {

        return this.constructor.name;

    }

}