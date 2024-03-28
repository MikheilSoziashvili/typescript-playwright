module.exports = {
    extends: ['eslint:recommended', 
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:playwright/recommended'
  ],
  rules: {
		"@typescript-eslint/naming-convention": "off",
		// Note: disable the base rule as it can report incorrect errors
		"no-return-await": "off",
		"@typescript-eslint/return-await": ["warn", "in-try-catch"],
		"arrow-body-style": "warn",
		"no-console": "off",
		"no-var": "warn",
		"prefer-const": "warn",
		"no-constant-condition": "off",
		"no-inner-declarations": "off",
		"no-dupe-class-members": "off",
		"@typescript-eslint/no-invalid-void-type": [
			"warn",
			{ allowAsThisParameter: true },
		],
		"no-restricted-properties": [
			"warn",
			{
				property: "emitAsync",
				message: "use .rpc.foo(x) instead of .emitAsync('foo', x)",
			},
			{
				property: "then",
				message: "use async / await instead of .then",
			},
			{
				property: "catch",
				message:
					"use async / await + a normal try {} catch(e) block instead of .catch",
			},
		],
		"require-atomic-updates": "off", // until https://github.com/eslint/eslint/issues/11899
		"no-throw-literal": "error",
		"object-shorthand": ["warn", "consistent"],
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/prefer-interface": "off",
		"@typescript-eslint/explicit-member-accessibility": "off",
		"@typescript-eslint/explicit-module-boundary-types": "warn",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"@typescript-eslint/no-var-requires": "warn",
		"@typescript-eslint/no-non-null-assertion": "warn",
		"@typescript-eslint/no-namespace": "warn",
		"@typescript-eslint/await-thenable": "warn",
		"@typescript-eslint/no-floating-promises": "warn",
		"@typescript-eslint/no-unnecessary-condition": [
			"warn",
			{ allowConstantLoopConditions: true },
		],
		"@typescript-eslint/no-misused-promises": [
			"warn",
			{
				/**
				 * This is a compromise. this lint triggers when functions
				 * return a promise but they are used in places where that
				 * promise result is never read. that can indicate an issue, but
				 * sadly due to library design of express and often event
				 * handlers this lint has too many false positives.
				 */
				checksVoidReturn: {
					arguments: false, // primarily async functions used as callbacks
					attributes: false, // primarily async functions react event handlers
				},
			},
		],
		"@typescript-eslint/no-unnecessary-type-assertion": "warn",
		"@typescript-eslint/no-unsafe-argument": "warn",
		"@typescript-eslint/no-unsafe-assignment": "warn",
		"@typescript-eslint/no-unsafe-call": "warn",
		"@typescript-eslint/no-unsafe-member-access": "warn",
		"@typescript-eslint/no-unsafe-return": "warn",
		"@typescript-eslint/restrict-plus-operands": "warn",
		"@typescript-eslint/restrict-template-expressions": "warn",
		"@typescript-eslint/unbound-method": "warn",
		"@typescript-eslint/no-confusing-void-expression": [
			"warn",
			{ ignoreArrowShorthand: true },
		],

		"no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				vars: "all",
				args: "after-used",
				varsIgnorePattern: "^_.",
				argsIgnorePattern: "^_",
			},
		],
    "@typescript-eslint/consistent-type-definitions": "off",
    "playwright/expect-expect": "off"
	},
	ignorePatterns: [
		"node_modules",
    "test-results",
    "playwright-report",
    ".vscode",
    ".eslintrc.cjs",
    ".DS_Store"
	],
	overrides: [
		{
			// https://github.com/typescript-eslint/typescript-eslint/issues/109
			files: ["*.js"],
			rules: {
				"@typescript-eslint/no-var-requires": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
			},
		},
	],
	settings: {
		playwright: {
      globalAliases: {}
    }
	},
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
  };