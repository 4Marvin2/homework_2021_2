'use strict';

QUnit.module('Тестируем функцию solve', function () {
	QUnit.test('solve работает правильно ', function (assert) {
		assert.strictEqual(solve('x + 1', 1), 2);
		assert.strictEqual(solve('2 + x - 1', 5), 6);
		assert.strictEqual(solve('2 * x - 1', 5), 9);
		assert.strictEqual(solve('2 * ( x - 1 )', 5), 8);
		assert.strictEqual(solve('(5 - x) * (x + 5)', 3), 16);
		assert.strictEqual(solve('((5 - x) * (x + 5)) * x * x', 3), 144);
		assert.strictEqual(solve('x + (x - 3))', 2), "Ошибка в выражении");
		assert.strictEqual(solve('a++', 3), "Формат выражения не верен! Выражение может содержать только цифры и знаки операций");
		assert.strictEqual(solve('Hello + x', 3), "Формат выражения не верен! Выражение может содержать только цифры и знаки операций");
	});
});
