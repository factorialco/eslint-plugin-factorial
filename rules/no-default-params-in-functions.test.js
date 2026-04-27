const { RuleTester } = require('eslint');
const rule = require('./no-default-params-in-functions');

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
});

ruleTester.run('no-default-params-in-functions', rule, {
    valid: [
        // Function declarations with no default parameters
        'function example(a, b, c) { return a + b + c; }',
        'function example() { return 0; }',

        // Function declarations with one default parameter
        'function example(a, b = 2, c) { return a + b + c; }',
        'function example(a = 1, b, c) { return a + b + c; }',
        'function example(a, b, c = 3) { return a + b + c; }',
        'function example(a = 1) { return a; }',

        // Function expressions with no default parameters
        'const func = function(a, b, c) { return a + b + c; }',
        'const func = function() { return 0; }',

        // Function expressions with one default parameter
        'const func = function(a, b = 2, c) { return a + b + c; }',
        'const func = function(a = 1, b, c) { return a + b + c; }',
        'const func = function(a, b, c = 3) { return a + b + c; }',
        'const func = function(a = 1) { return a; }',

        // Arrow functions with no default parameters
        'const arrow = (a, b, c) => a + b + c;',
        'const arrow = () => 0;',

        // Arrow functions with one default parameter
        'const arrow = (a, b = 2, c) => a + b + c;',
        'const arrow = (a = 1, b, c) => a + b + c;',
        'const arrow = (a, b, c = 3) => a + b + c;',
        'const arrow = (a = 1) => a;',

        // Destructuring with one default
        'function example({ a = 1, b, c }) { return a + b + c; }',
        'const arrow = ({ a = 1, b, c }) => a + b + c;',

        // Array destructuring with one default
        'function example([a = 1, b, c]) { return a + b + c; }',
        'const arrow = ([a = 1, b, c]) => a + b + c;',

        // Mixed destructuring with one default
        'function example(a, { b = 2, c, d }) { return a + b + c + d; }',
        'const arrow = (a, { b = 2, c, d }) => a + b + c + d;',
    ],

    invalid: [
        // Function declarations with multiple default parameters
        {
            code: 'function example(a = 1, b = 2, c) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'function example(a, b = 2, c = 3) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'function example(a = 1, b = 2, c = 3) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'function example(a = 1, b = 2) { return a + b; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },

        // Function expressions with multiple default parameters
        {
            code: 'const func = function(a = 1, b = 2, c) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const func = function(a, b = 2, c = 3) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const func = function(a = 1, b = 2, c = 3) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const func = function(a = 1, b = 2) { return a + b; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },

        // Arrow functions with multiple default parameters
        {
            code: 'const arrow = (a = 1, b = 2, c) => a + b + c;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = (a, b = 2, c = 3) => a + b + c;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = (a = 1, b = 2, c = 3) => a + b + c;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = (a = 1, b = 2) => a + b;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },

        // Destructuring with multiple defaults
        {
            code: 'function example({ a = 1, b = 2, c }) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = ({ a = 1, b = 2, c }) => a + b + c;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },

        // Array destructuring with multiple defaults
        {
            code: 'function example([a = 1, b = 2, c]) { return a + b + c; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = ([a = 1, b = 2, c]) => a + b + c;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },

        // Mixed destructuring with multiple defaults
        {
            code: 'function example(a = 1, { b = 2, c, d }) { return a + b + c + d; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = (a = 1, { b = 2, c, d }) => a + b + c + d;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },

        // Complex cases with multiple defaults
        {
            code: 'function example(a = 1, b = 2, c = 3, d = 4) { return a + b + c + d; }',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
        {
            code: 'const arrow = (a = 1, b = 2, c = 3, d = 4) => a + b + c + d;',
            errors: [
                {
                    message:
                        'Functions should not have more than one default parameter. Consider using an options object or destructuring instead.',
                },
            ],
        },
    ],
});
