// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const {defineConfig} = require("eslint-define-config");

module.exports = defineConfig({
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
    },
    ignorePatterns: ["migrations", "src/generated", "**/*.spec.ts", "**/*.e2e.ts"], // optimize this
    extends: ["@rubiin/eslint-config-ts"],
    root: true,
    settings: {
        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: "./tsconfig.json",
            },
        },
    },
    rules: {
        "unicorn/prefer-module": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "no-useless-constructor": "off", // optimize this
        "@typescript-eslint/require-await": "off", // optimize this
        "@typescript-eslint/no-unsafe-assignment": "off", // optimize this
        "@typescript-eslint/no-unsafe-member-access": "off", // optimize this
        "unicorn/prefer-top-level-await": "off",
        "max-nested-callbacks": "off", // rxjs is nested
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: false,
            },
        ],
        "unicorn/prevent-abbreviations": [
            "error",
            {
                ignore: [
                    "\\.e2e*",
                    "\\.spec*",
                    "\\.decorator*",
                    "\\*idx*",
                ],
                allowList: {
                    ProcessEnv: true,
                    UUIDParam: true,
                },
            },
        ],
    },
});
