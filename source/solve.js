'use strict';

/**
 * Возвращает значение выражения с подставленным x.
 *
 * @param {string} expression Арифметическое выражение.
 * @param {number} xValue Значение x в данном выражении.
 * @return {number} Вычисленное значение этого выражения.
 */

const solve = (expression, xValue) => eval(expression.replace(/x/g, String(xValue)));
