'use strict';

QUnit.module('Тестируем функцию solve', function () {
	const EXPRESSION_ERROR = 'Expression error.';
	const SYNTAX_ERROR = 'expression can only contain numbers, operation signs and the x variable.';
	const TYPE_ERROR = 'Invalid type of expression';

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
	QUnit.test('solve правильно обрабатывает ошибку с ошибками в выражении ', function (assert) {
		assert.throws(function() {
						       solve('x + (x - 3))', 2);
						   },
						   function (err) {
							   return String(err.message) === EXPRESSION_ERROR;
						   },
						   'Error thrown');
		assert.throws(function() {
						       solve('x + ((x - 1', 2);
						   },
						   function (err) {
							   return String(err.message) === EXPRESSION_ERROR;
						   },
						   'Error thrown');
		assert.throws(function() {
					      solve('x + (x * (7 - ( 5 + 1))', 2);
					  },
					  function (err) {
						  return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('x + (7 - 1) * ((x - 1)', 2);
					  },
					  function (err) {
						  return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('()', 2);
					  },
					  function (err) {
						  return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('(+)', 2);
					  },
					  function (err) {
						  return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('x x x', 2);
					  },
					  function (err) {
						  return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('x++', 2);
					  },
					  function (err) {
					      return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('x ++ (5 - 1)', 2);
					  },
					  function (err) {
					      return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('x**2', 2);
					  },
					  function (err) {
					      return String(err.message) === EXPRESSION_ERROR;
					  },
					  'Error thrown');
	});
	QUnit.test('solve правильно обрабатывает ошибку с запрещенными символами в выражении ', function (assert) {
		assert.throws(function() {
						  solve('x  + 4 -(  5 - 2)', 'a');
						},
					  function (err) {
						  return String(err.message) === SYNTAX_ERROR;
						},
					  'Error thrown');
		assert.throws(function() {
					  	  solve('4 * 6 + (5 - 1 * x)', 'x');
						},
					  function (err) {
						  return String(err.message) === SYNTAX_ERROR;
						},
					  'Error thrown');
		assert.throws(function() {
					      solve('2abc*x*3', 3);
					  },
					  function (err) {
						  return String(err.message) === SYNTAX_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					  	  solve('x^100', 3);
					  },
					  function (err) {
						  return String(err.message) === SYNTAX_ERROR;
					  },
					 'Error thrown');
		assert.throws(function() {
					      solve('a++', 3);
					  },
					  function (err) {
						  return String(err.message) === SYNTAX_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve('Hello + x', 3);
					  },
					  function (err) {
						  return String(err.message) === SYNTAX_ERROR;
					  },
					  'Error thrown');
		assert.throws(function() {
					      solve(5, 5);
					  },
					  function (err) {
						  return String(err.message) === TYPE_ERROR;
					  },
					  'Error thrown');
	});
});
