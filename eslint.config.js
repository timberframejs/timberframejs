import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import nounsanitized from "eslint-plugin-no-unsanitized";

export default [
  { ignores: ["dist/**/*", "node_modules/**/*", "**/*.js"] },
  { files: ["**/*.{ts,mts,cts}"], ...js.configs.recommended, languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  nounsanitized.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-prototype-builtins": "off"
    }
  }
];
