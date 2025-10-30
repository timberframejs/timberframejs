import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], ...js.configs.recommended, languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
];
