const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
    {
        ignores: ['node_modules/**', '.aws-sam/**'],
    },

    eslint.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },

    {
        files: ['*.js'],
        languageOptions: {
            globals: {
                require: 'readonly',
                module: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    prettierRecommended,
];
