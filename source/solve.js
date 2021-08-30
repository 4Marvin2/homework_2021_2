'use strict';

const DIGIT = /[0-9]/;
const NO_VALID_SYMBOLS = /^[-+*\/()0-9\sx]+$/;

const SYNTAX_ERROR = 'Syntax error: expression can only contain numbers, operation signs and the x variable.';
const EXPRESSION_ERROR = 'Expression error.';

/**
 * Проверяет правильность расстановки скобок в выражении.
 *
 * @param {string} expression Выражение.
 * @return {boolean} Выражение верно (true) или выражение не верно (false).
 */

const checkBrackets = (expression) => {
    let stack = [];
    const open = '(';
    const close = ')';

    for (const symbol of expression) {
        let i = open.indexOf(symbol);
        if (i > -1) {
            stack.push(close[i]);
        }
        if (close.includes(symbol) && (symbol != stack.pop())) {
            return false;
        }
    }

    return stack.length == 0;
};

/**
 * Возвращает приоритет арифметического оператора.
 *
 * @param {char} operator Оператор.
 * @return {number} Приоритет оператора.
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
    };
};

/**
 * Проверяет является ли символ оператором.
 *
 * @param {char} symbol Символ.
 * @return {boolean} Является (true) или не является (false) оператором.
 */

const isOperator = (symbol) => {
    if (/[-+*\/()]/.test(symbol)) {
        return true;
    }
    return false;
};

/**
 * Проверяет является ли символ цифрой.
 *
 * @param {char} symbol Символ.
 * @return {boolean} Является (true) или не является (false) цифрой.
 */

const isDigit = (symbol) => {
    if (DIGIT.test(symbol)) {
        return true;
    }
    return false;
};

/**
 * Возвращает выражение переведенное в постфиксную форму.
 *
 * @param {string} expression Арифметическое выражение.
 * @return {string} Выражение в постфиксной форме.
 */

const toRPN = (expression) => {
    if (typeof(expression) != 'string') {
        throw new TypeError('Invalid type of expression');
    }

    let rpn = '';
    let operatorsStack = [];
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
                    if (getPriority(expression[i]) <= (getPriority(operatorsStack[operatorsStack.length - 1]))) {
                        rpn += operatorsStack.pop() + ' ';
                    }
                }
                operatorsStack.push(expression[i]);
            }
        }
    }

    while (operatorsStack.length > 0) {
        rpn += operatorsStack.pop() + ' ';
    }

    return rpn;
};

/**
 * Возвращает результат выполнения арифметической операции.
 *
 * @param {char} operator Арифметическое выражение.
 * @param {number} firstArgument Значение первого операнда.
 * @param {number} secondArgument Значение второго операнда.
 * @return {number} Вычисленное значение операции.
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
    }
};

/**
 * Возвращает посчитанное значение выражения в ОПЗ.
 *
 * @param {string} expression Арифметическое выражение.
 * @return {number} Вычисленное значение этого выражения.
 */

const calculateRPN = (expression) => {
    if (typeof(expression) != 'string') {
        throw new TypeError('Invalid type of expression');
    }

    let stack = [];

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

    return stack.pop();
};

/**
 * Возвращает значение выражения с подставленным x.
 *
 * @param {string} expression Арифметическое выражение.
 * @param {number} xValue Значение x в данном выражении.
 * @return {number} Вычисленное значение этого выражения.
 */

const solve = (expression, xValue) => {
    if (!(NO_VALID_SYMBOLS.test(expression)) || (!(isDigit(xValue)))) {
        return SYNTAX_ERROR;
    }

    if (!(checkBrackets(expression))) {
        return EXPRESSION_ERROR;
    }

    const str = expression.replace(/x/g, String(xValue));

    let rpn = '';
    try {
        rpn = toRPN(str);
    } catch (e) {
        return e.message;
    }

    let result = 0;
    try {
        result = calculateRPN(rpn);
    } catch (e) {
        return e.message;
    }

    return result;
};
