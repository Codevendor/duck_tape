'use strict';

import { number_represent } from "../helpers/number_represent.ts";
import { type_of } from "../deps.ts";
import { DuckTapeRuleError } from "../errors/DuckTapeRuleError.ts";
import { DuckTapeTypeError } from "../errors/DuckTapeTypeError.ts";

// Regex functions
const REG_FUNC = new RegExp(`^.*?\((.*)\)`);
const REG_ALPHA = new RegExp(`^[a-zA-Z]+$`);
const REG_NUMERIC = new RegExp(`^[0-9]+$`);
const REG_NUMBER = new RegExp(`^[+-]{0,1}[0-9]{1,}[.]{0,1}[0-9]{0,}[e]{0,1}[+-]{0,1}[0-9]{0,}$`);
const REG_ALPHA_NUMERIC = new RegExp(`^[a-zA-Z0-9]+$`);


/**
 * For expecting a parameter type and returning a type error if it doesn't match.
 * @param {number} pnumber - The parameter number.
 * @param {any} param - The parameter.
 * @param {string|array} ptype - The required type as a string or array of string types.
 * @param {function} func - The function name.
 * @param {array} rules - The rules for the value of the parameter. 
 * @returns 
 */
export function duct_tape(pnumber: number, param: unknown, ptype: string | string[], func: Function, rules: (string | object)[] = []) {

    const param_type = type_of(param);
    if (type_of(ptype) === 'string') ptype = [ptype as string];

    // Get the function as a string.
    const mfunc = func.toString().match(REG_FUNC);
    if (type_of(mfunc) !== 'array') throw new Error(`Error with duct_tape not finding func parameter.`);

    let fname = mfunc![0];

    const params = fname.substring(fname.indexOf('(') + 1, fname.lastIndexOf(')'));
    const params_array = params.split(',').map(item => item.trim());;

    params_array[pnumber - 1] = params_array[pnumber - 1] + ': <' + (<string[]>ptype).join('|') + '>';
    const nparams = ' ' + params_array.join(', ') + ' ';

    fname = fname.replace(params, nparams);

    const pname = number_represent(pnumber);

    // Parameter type check.
    if (!ptype.includes(param_type)) throw new DuckTapeTypeError(`Incorrect ${pname} parameter type (${param_type})! in \n${fname}`);

    // Rule check
    if (Array.isArray(rules) && rules.length > 0) {

        for (let i = 0; i < rules.length; i++) {

            let rule = '';
            let value = '';

            // Check if rule is string or object.
            if (type_of(rules[i]) === 'object') {

                const keys = Object.keys(rules[i]);
                if (type_of(keys) === 'array' && keys.length === 1) value = keys[0];

            } else {

                rule = rules[i] as string;
            }

            // Get rule and value
            rule = rule.toString().toUpperCase();

            switch (rule) {

                case 'REGEX':

                    const reg = new RegExp(value);
                    if (reg.test(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nValue must match regex (${value})!`);

                    break;

                case 'ALPHA':

                    if (!REG_ALPHA.test(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nMust be alpha characters (a-zA-Z)!`);

                    break;

                case 'NUMBER':

                    if (!REG_NUMBER.test(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nMust be a valid js number!`);

                    break;

                case 'NUMERIC':

                    if (!REG_NUMERIC.test(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nMust be a numeric characters (0-9)!`);

                    break;

                case 'ALPHANUMERIC':
                case 'ALPHA_NUMERIC':
                case 'ALPHA-NUMERIC':

                    if (!REG_ALPHA_NUMERIC.test(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nMust be alpha numeric characters (a-zA-Z0-9)!`);

                    break;

                case 'NOTSTRINGEMPTY':
                case 'NOT_STRING_EMPTY':
                case 'NOT-STRING-EMPTY':

                    if ((<string>param).trim() === '') throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nCannot be string empty!`);

                    break;

                case 'INLIST':
                case 'IN_LIST':
                case 'IN-LIST':

                    if (!value.includes(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nMust be in allowed list (${JSON.stringify(value)})!`);

                    break;

                case 'NOTINLIST':
                case 'NOT_IN_LIST':
                case 'NOT-IN-LIST':

                    if (value.includes(param as string)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\nMust not be in list (${JSON.stringify(value)})!`);

                    break;

                case 'GREATERTHAN':
                case 'GREATER_THAN':
                case 'GREATER-THAN':

                    if ((param as number) < parseInt(value)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\n${param} must be greater than ${value})!`);

                    break;

                case 'GREATERTHANEQUAL':
                case 'GREATER_THAN_EQUAL':
                case 'GREATER-THAN-EQUAL':

                    if ((param as number) < parseInt(value)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\n${param} must be greater than equal ${value})!`);

                    break;

                case 'LESSTHAN':
                case 'LESS_THAN':
                case 'LESS-THAN':

                    if ((param as number) > parseInt(value)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\n${param} must be less than ${value})!`);

                    break;

                case 'LESSTHANEQUAL':
                case 'LESS_THAN_EQUAL':
                case 'LESS-THAN-EQUAL':

                    if ((param as number) > parseInt(value)) throw new DuckTapeRuleError(`Incorrect ${pname} parameter value (Rule: ${rule})! in \n${fname}\n${param} must be less than equal ${value})!`);

                    break;

                // No rule found
                default:

                    throw new DuckTapeRuleError(`No expect rule found for (Missing Rule: ${rule})! in \n${fname}`);

                    break;

            }

        }

    }


    // Return the parameter type for extra processing.
    return param_type;

}