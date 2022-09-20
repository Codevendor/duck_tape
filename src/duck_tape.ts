'use strict';

import { type_of } from "../deps.ts";
import DuckTapeRuleError from "../errors/duck_tape_rule_error.ts";
import DuckTapeTypeError from "../errors/duck_tape_type_error.ts";

// Regex functions
const REG_ALPHA = new RegExp(`^[a-zA-Z]+$`);
const REG_NUMERIC = new RegExp(`^[0-9]+$`);
const REG_NUMBER = new RegExp(`^[+-]{0,1}[0-9]{1,}[.]{0,1}[0-9]{0,}[e]{0,1}[+-]{0,1}[0-9]{0,}$`);
const REG_ALPHA_NUMERIC = new RegExp(`^[a-zA-Z0-9]+$`);

/**
 * For expecting a parameter type and returning a type error if it doesn't match.
 * @param {Function} method - The function name.
 * @param {number} param_position - The parameter index number starting at 1.
 * @param {any} param - The parameter.
 * @param {string|array} expected_type - The expected js type as a string or array of multiple string types.
 * @param {array} rules - The rules for the value of the parameter. 
 * @returns {string} - Returns the actual type_of() string for continued processing. 
 */
export function duck_tape(method: Function, param_position: number, param: any, expected_type: string | string[], rules: (string | object)[] = []) {

    // Get the actual param type.
    const actual_type = type_of(param);

    // If expected is string changed to array for easier parsing.
    if (type_of(expected_type) === 'string') expected_type = [expected_type as string];

    // Parameter type check.
    if (!expected_type.includes(actual_type)) throw new DuckTapeTypeError(method, param_position, param, <string[]>expected_type, actual_type);

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
                    if (reg.test(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'ALPHA':

                    if (!REG_ALPHA.test(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'NUMBER':

                    if (!REG_NUMBER.test(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'NUMERIC':

                    if (!REG_NUMERIC.test(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'ALPHANUMERIC':
                case 'ALPHA_NUMERIC':
                case 'ALPHA-NUMERIC':

                    if (!REG_ALPHA_NUMERIC.test(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'NOTSTRINGEMPTY':
                case 'NOT_STRING_EMPTY':
                case 'NOT-STRING-EMPTY':

                    if ((<string>param).trim() === '') throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'INLIST':
                case 'IN_LIST':
                case 'IN-LIST':

                    if (!value.includes(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'NOTINLIST':
                case 'NOT_IN_LIST':
                case 'NOT-IN-LIST':

                    if (value.includes(param as string)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'GREATERTHAN':
                case 'GREATER_THAN':
                case 'GREATER-THAN':

                    if ((param as number) < parseInt(value)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'GREATERTHANEQUAL':
                case 'GREATER_THAN_EQUAL':
                case 'GREATER-THAN-EQUAL':

                    if ((param as number) < parseInt(value)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'LESSTHAN':
                case 'LESS_THAN':
                case 'LESS-THAN':

                    if ((param as number) > parseInt(value)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                case 'LESSTHANEQUAL':
                case 'LESS_THAN_EQUAL':
                case 'LESS-THAN-EQUAL':

                    if ((param as number) > parseInt(value)) throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value);

                    break;

                // No rule found
                default:

                    throw new DuckTapeRuleError(method, param_position, param, <string[]>expected_type, actual_type, rule, value, true);

                    break;

            }

        }

    }

    // Return the actual parameter type for continued processing.
    return actual_type;

}