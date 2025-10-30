import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist/**/*", "node_modules/**/*", "**/*.js"] },
  { files: ["**/*.{ts,mts,cts}"], ...js.configs.recommended, languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
];
