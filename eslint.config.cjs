const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");

const tseslint = require("typescript-eslint");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "plugin:playwright/recommended",
    ),

    rules: {
        "@typescript-eslint/naming-convention": "off",
        "no-return-await": "off",
        "@typescript-eslint/return-await": ["warn", "in-try-catch"],
        "arrow-body-style": "warn",
        "no-console": "off",
        "no-var": "warn",
        "prefer-const": "warn",
        "no-constant-condition": "off",
        "no-inner-declarations": "off",
        "no-dupe-class-members": "off",

        "@typescript-eslint/no-invalid-void-type": ["warn", {
            allowAsThisParameter: true,
        }],

        "no-restricted-properties": ["warn", {
            property: "emitAsync",
            message: "use .rpc.foo(x) instead of .emitAsync('foo', x)",
        }, {
            property: "then",
            message: "use async / await instead of .then",
        }, {
            property: "catch",
            message: "use async / await + a normal try {} catch(e) block instead of .catch",
        }],

        "require-atomic-updates": "off",
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

        "@typescript-eslint/no-unnecessary-condition": ["warn", {
            allowConstantLoopConditions: true,
        }],

        "@typescript-eslint/no-misused-promises": ["warn", {
            checksVoidReturn: {
                arguments: false,
                attributes: false,
            },
        }],

        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/restrict-plus-operands": "warn",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/unbound-method": "warn",
        "@typescript-eslint/no-unused-expressions": ["warn", {
            allowShortCircuit: true,
            allowTernary: true,
            allowTaggedTemplates: true,
        }],
        "@typescript-eslint/no-confusing-void-expression": ["warn", {
            ignoreArrowShorthand: true,
        }],

        "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],

        "@typescript-eslint/no-unused-vars": ["warn", {
            vars: "all",
            args: "after-used",
            varsIgnorePattern: "^_.",
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/consistent-type-definitions": "off",
        "playwright/expect-expect": "off",
    },

    settings: {
        playwright: {
            globalAliases: {},
        },
    },

    languageOptions: {
        parser: tsParser,

        parserOptions: {
            project: true,
            tsconfigRootDir: __dirname,
        },
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },
}, globalIgnores([
    "**/node_modules",
    "**/test-results",
    "**/playwright-report",
    "**/.vscode",
    "**/.eslintrc.cjs",
    "**/eslint.config.cjs",
    "**/.DS_Store",
]), 
{
    files: ["**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "script",
        globals: {
          require: "readonly",
          module: "readonly",
          process: "readonly",
          __dirname: "readonly",
          __filename: "readonly",
        },
    },
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "no-undef": "off",
      },
}]);