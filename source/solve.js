'use strict';

/**
 * Проверяет правильность расстановки скобок в выражении.
 *
 * @param {string} expression Выражение.
 * @return {boolean} Выражение верно (true) или выражение не верно (false).
 */

const checkBrackets = (expression) => {
    let stack = [];
    const open = "(";
    const close = ")";

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
}

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
}

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
}


/**
 * Проверяет является ли символ цифрой.
 *
 * @param {char} symbol Символ.
 * @return {boolean} Является (true) или не является (false) цифрой.
 */

const isDigit = (symbol) => {
    if (/[0-9]/.test(symbol)) {
        return true;
    }
    return false;
}

/**
 * ВВозвращает выражение переведенное в постфиксную форму.
 *
 * @param {string} expression Арифметическое выражение.
 * @return {string} Выражение в постфиксной форме.
 */

const toRPN = (expression) => {
    let rpn = "";
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
}

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
}

/**
 * Возвращает значение выражения с подставленным x.
 *
 * @param {string} expression Арифметическое выражение.
 * @param {number} xValue Значение x в данном выражении.
 * @return {number} Вычисленное значение этого выражения.
 */

const solve = (expression, xValue) => {
    const str = expression.replace(/x/g, String(xValue));

    if (!(/^[-+*\/()0-9\s]/.test(str))) {
        return "Формат выражения не верен! Выражение может содержать только цифры и знаки операций";
    }

    if (!(checkBrackets(expression))) {
        return "Ошибка в выражении";
    }

    const rpn = toRPN(str);

    let stack = [];

    for (let i = 0; i < rpn.length; i++) {
        if (isDigit(rpn[i])) {
            let fullNumber = "";
            while (isDigit(rpn[i])) {
                fullNumber += rpn[i];
                i++;
                if (i == rpn.length) {
                    break;
                }
            }
            stack.push(parseInt(fullNumber));
            i--;
        } else if (isOperator(rpn[i])) {
            const firstArgument = stack.pop();
            const secondArgument = stack.pop();
            stack.push(operations(rpn[i], firstArgument, secondArgument));
        }
    }

    return stack.pop();
}
