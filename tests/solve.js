'use strict';

QUnit.module('Тестируем функцию solve', function() {
    const EXPRESSION_ERROR = 'Expression error.';
    const SYNTAX_ERROR = 'expression can only contain numbers, operation signs and the x variable.';
    const TYPE_ERROR = 'Invalid type of expression';

    QUnit.test('solve работает правильно ', function(assert) {
        assert.strictEqual(solve('x + 1', 1), 2);
        assert.strictEqual(solve('2 + x - 1', 5), 6);
        assert.strictEqual(solve('2 * x - 1', 5), 9);
        assert.strictEqual(solve('2 * ( x - 1 )', 5), 8);
        assert.strictEqual(solve('(5 - x) * (x + 5)', 3), 16);
        assert.strictEqual(solve('((5 - x) * (x + 5)) * x * x', 3), 144);
        assert.strictEqual(solve('x  + 4 -(  5 - 2)', 2), 3);
    });
    QUnit.test('solve работает правильно с лишними пробелами и без пробелов ', function(assert) {
        assert.strictEqual(solve('x  + 4 -(  5 - 2)', 2), 3);
        assert.strictEqual(solve('x  +    4 *  (  5   - 2)', 2), 14);
        assert.strictEqual(solve('2+4*(5-x)', 1), 18);
    });
    QUnit.test('solve правильно обрабатывает ошибку с ошибками в выражении ', function(assert) {
        assert.throws(() => solve('x + (x - 3))', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x + ((x - 1', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x + (x * (7 - ( 5 + 1))', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x + (7 - 1) * ((x - 1)', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('()', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('(+)', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x x x', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x++', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x ++ (5 - 1)', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
        assert.throws(() => solve('x**2', 2), new Error(EXPRESSION_ERROR), 'Error thrown');
    });
    QUnit.test('solve правильно обрабатывает ошибку с запрещенными символами в выражении ', function(assert) {
        assert.throws(() => solve('', 'a'), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve('x  + 4 -(  5 - 2)', 'a'), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve('4 * 6 + (5 - 1 * x)', 'x'), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve('2abc*x*3', 3), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve('x^100', 3), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve('a++', 3), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve('Hello + x', 3), new SyntaxError(SYNTAX_ERROR), 'Error thrown');
        assert.throws(() => solve(5, 5), new TypeError(TYPE_ERROR), 'Error thrown');
    });
});
