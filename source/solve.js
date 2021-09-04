'use strict';

const DIGIT_REGEX = /[0-9]/;
const NO_VALID_SYMBOLS_REGEX = /^[-+*\/()0-9\sx]+$/;
const OPERATORS_REGEX = /[-+*\/()]/

const EXPRESSION_ERROR = 'Expression error.';
const SYNTAX_ERROR = 'expression can only contain numbers, operation signs and the x variable.';
const TYPE_ERROR = 'Invalid type of expression';

/**
 * Проверяет правильность расстановки скобок в выражении.
 *
 * @param {string} expression Выражение.
 * @return {boolean} Выражение верно (true) или выражение не верно (false).
 */

const checkBrackets = (expression) => {
    const stack = [];
    const open = '(';
    const close = ')';

    for (const symbol of expression) {
        const i = open.indexOf(symbol);
        if (i > -1) {
            stack.push(close[i]);
        }
        if (close.includes(symbol) && symbol != stack.pop()) {
            return false;
        }
    }

    return stack.length == 0;
};

/**
 * Возвращает приоритет арифметического оператора.
 *
 * @param {string} operator Оператор.
 * @return {number|null} Если оператор ()+-/*, то приоритет оператора, иначе null
 */

const getPriority = (operator) => {
    switch (operator) {
        case '(':
            return 0;
        case ')':
            return 1;
        case '+':
            return 2;
        case '-':
            return 3;
        case '*':
            return 4;
        case '/':
            return 4;
        default:
            return null;
    };
};

/**
 * Проверяет является ли символ оператором.
 *
 * @param {string} symbol Символ.
 * @return {boolean} Является (true) или не является (false) оператором.
 */

const isOperator = (symbol) => {
    if (OPERATORS_REGEX.test(symbol)) {
        return true;
    }
    return false;
};

/**
 * Проверяет является ли символ цифрой.
 *
 * @param {string} symbol Символ.
 * @return {boolean} Является (true) или не является (false) цифрой.
 */

const isDigit = (symbol) => {
    if (DIGIT_REGEX.test(symbol)) {
        return true;
    }
    return false;
};

/**
 * Возвращает выражение переведенное в постфиксную форму.
 *
 * @param {string} expression Арифметическое выражение.
 * @return {string} Выражение в постфиксной форме.
 * @throws {TypeError} Выражение не является строкой
 * @throws {Error} Ошибка в выражении
 */

const stringToPostfix = (expression) => {
    if (typeof(expression) !== 'string') {
        throw new TypeError(TYPE_ERROR);
    }

    let rpn = '';
    const operatorsStack = [];
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == ' ') {
            continue;
        }
        if (isDigit(expression[i])) {
            while (isDigit(expression[i])) {
                rpn += expression[i];
                i++;
                if (i == expression.length) {
                    break;
                }
            }

            rpn += ' ';
            i--;
        }
        if (isOperator(expression[i])) {
            if (expression[i] == '(') {
                operatorsStack.push(expression[i]);
            } else if (expression[i] == ')') {
                let bracketsSymbol = operatorsStack.pop();

                while (bracketsSymbol != '(') {
                    rpn += bracketsSymbol + ' ';
                    bracketsSymbol = operatorsStack.pop();
                }
            } else {
                if (operatorsStack.length > 0) {
                    const topOpr = operatorsStack[operatorsStack.length - 1]
                    if (getPriority(expression[i]) <= getPriority(topOpr)) {
                        rpn += operatorsStack.pop() + ' ';
                    }
                }
                operatorsStack.push(expression[i]);
            }
        }
    }

    if (operatorsStack.length > 0) {
        const reducer = (accum, currOperator) => accum + currOperator + ' ';
        rpn += operatorsStack.reduceRight(reducer) + ' '
    }

    if (!(OPERATORS_REGEX.test(rpn) && DIGIT_REGEX.test(rpn))) {
        throw new Error(EXPRESSION_ERROR);
    }

    return rpn;
};

/**
 * Возвращает результат выполнения арифметической операции.
 *
 * @param {string} operator Арифметическое выражение.
 * @param {number} firstArgument Значение первого операнда.
 * @param {number} secondArgument Значение второго операнда.
 * @return {number|null} Если оператор +-/*, то посчитанное число, иначе null
 */

const operations = (operator, firstArgument, secondArgument) => {
    let result;
    switch (operator) {
        case '+':
            result = secondArgument + firstArgument;
            return result;
        case '-':
            result = secondArgument - firstArgument;
            return result;
        case '*':
            result = secondArgument * firstArgument;
            return result;
        case '/':
            result = secondArgument / firstArgument;
            return result;
        default:
            return null;
    }
};

/**
 * Возвращает посчитанное значение выражения в ОПЗ.
 *
 * @param {string} expression Арифметическое выражение.
 * @return {number} Вычисленное значение этого выражения.
 * @throws {TypeError} Выражение не является строкой
 * @throws {Error} Ошибка в выражении
 */

const calculatePostfix = (expression) => {
    if (typeof(expression) != 'string') {
        throw new TypeError(TYPE_ERROR);
    }

    const stack = [];

    for (let i = 0; i < expression.length; i++) {
        if (isDigit(expression[i])) {
            let fullNumber = '';
            while (isDigit(expression[i])) {
                fullNumber += expression[i];
                i++;
                if (i == expression.length) {
                    break;
                }
            }
            stack.push(parseInt(fullNumber));
            i--;
        } else if (isOperator(expression[i])) {
            const firstArgument = stack.pop();
            const secondArgument = stack.pop();
            stack.push(operations(expression[i], firstArgument, secondArgument));
        }
    }

    const result = stack.pop();

    if (isNaN(result)) {
        throw new Error(EXPRESSION_ERROR);
    }

    return result;
};

/**
 * Возвращает значение выражения с подставленным x.
 *
 * @param {string} expression Арифметическое выражение.
 * @param {number} xValue Значение x в данном выражении.
 * @return {number} Вычисленное значение этого выражения.
 * @throws {TypeError} Выражение не является строкой
 * @throws {SyntaxError} В выражении содержатся недопустимые символы
 * @throws {Error} Ошибка в выражении
 */

const solve = (expression, xValue) => {
    if (typeof(expression) != 'string') {
        throw new TypeError(TYPE_ERROR);
    }

    if (!NO_VALID_SYMBOLS_REGEX.test(expression) || !isDigit(xValue)) {
        throw new SyntaxError(SYNTAX_ERROR);
    }

    if (!checkBrackets(expression)) {
        throw new Error(EXPRESSION_ERROR);
    }

    const str = expression.replace(/x/g, String(xValue));

    const rpn = stringToPostfix(str);

    const result = calculatePostfix(rpn);

    return result;
};
