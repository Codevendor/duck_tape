'use strict';

import { type_of } from "../deps.ts";

// Regex functions
const REG_FUNC = new RegExp(`^.*?\((.*)\)`);

/**
 * Defines a function matching the parameter that had error.
 * @param {Function} method - The function name.
 * @param {number} param_position - The parameter index number starting at 1.
 * @param {array} expected_type - The expected js type as array of multiple string types.
 * @returns {string} - A definition string for the function and parameters.
 */
export default function define_function(method: Function, param_position: number, expected_type: string[]) {

    // Get the function as a string.
    const mfunc = method.toString().match(REG_FUNC);
    if (type_of(mfunc) !== 'array') return '';

    let fname = mfunc![0];

    const params = fname.substring(fname.indexOf('(') + 1, fname.lastIndexOf(')'));
    const params_array = params.split(',').map(item => item.trim());;

    params_array[param_position - 1] = `${params_array[param_position - 1]}: <${expected_type.join('|')}>`;
    const nparams = ` ${params_array.join(', ')} `;

    fname = fname.replace(params, nparams);

    return fname;

}