'use strict';

QUnit.module('Тестируем функцию solve', function () {
	const SYNTAX_ERROR = 'Syntax error: expression can only contain numbers, operation signs and the x variable.';
	const EXPRESSION_ERROR = 'Expression error.';

	QUnit.test('solve работает правильно ', function (assert) {
		assert.strictEqual(solve('x + 1', 1), 2);
		assert.strictEqual(solve('2 + x - 1', 5), 6);
		assert.strictEqual(solve('2 * x - 1', 5), 9);
		assert.strictEqual(solve('2 * ( x - 1 )', 5), 8);
		assert.strictEqual(solve('(5 - x) * (x + 5)', 3), 16);
		assert.strictEqual(solve('((5 - x) * (x + 5)) * x * x', 3), 144);
		assert.strictEqual(solve('x  + 4 -(  5 - 2)', 2), 3);
	});
	QUnit.test('solve работает правильно с лишними пробелами и без пробелов ', function (assert) {
		assert.strictEqual(solve('x  + 4 -(  5 - 2)', 2), 3);
		assert.strictEqual(solve('x  +    4 *  (  5   - 2)', 2), 14);
		assert.strictEqual(solve('2+4*(5-x)', 1), 18);
	});
	QUnit.test('solve правильно обрабатывает ошибку с недостающими скобками ', function (assert) {
		assert.strictEqual(solve('x + (x - 3))', 2), EXPRESSION_ERROR);
	});
	QUnit.test('solve правильно обрабатывает ошибку с запрещенными символами в выражении ', function (assert) {
		assert.strictEqual(solve('x  + 4 -(  5 - 2)', 'a'), SYNTAX_ERROR);
		assert.strictEqual(solve('4 * 6 + (5 - 1 * x)', 'x'), SYNTAX_ERROR);
		assert.strictEqual(solve('2abc*x*3', 3), SYNTAX_ERROR);
		assert.strictEqual(solve('x^100', 3), SYNTAX_ERROR);
		assert.strictEqual(solve('a++', 3), SYNTAX_ERROR);
		assert.strictEqual(solve('Hello + x', 3), SYNTAX_ERROR);
	});
});
