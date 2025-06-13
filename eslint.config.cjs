const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/**', 'dist/**'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.jest,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'eslint-comments/no-unused-disable': 'off'
        },
    },
];
