import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ignores: ['node_modules', 'dist', 'build', 'src/themes/*'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettierConfig,
  // ✅ Add this block so react-hooks rules are registered
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules, // <---- important
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
      react: pluginReact,
      'jsx-a11y': pluginJsxA11y,
    },
    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        fragment: 'Fragment',
        flowVersion: '0.53',
        version: 'detect',
      },
      'import/resolver': {
        node: {
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off',
      'react/display-name': 'off',
      'react/jsx-filename-extension': 'off',
      'no-param-reassign': 'off',
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/no-array-index-key': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/forbid-prop-types': 'off',
      'import/order': 'off',
      'import/no-cycle': 'off',
      'no-console': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'prefer-destructuring': 'off',
      'no-shadow': 'off',
      'import/no-named-as-default': 'off',
      'import/no-extraneous-dependencies': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/no-autofocus': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
        },
      ],
      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: false,
        },
      ],
      'prettier/prettier': [
        'warn',
        {
          bracketSpacing: true,
          printWidth: 140,
          singleQuote: true,
          trailingComma: 'none',
          tabWidth: 2,
          useTabs: false,
          endOfLine: 'auto',
          jsxSingleQuote: true,
        },
      ],
    },
  },
];
