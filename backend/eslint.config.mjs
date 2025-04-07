import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([

  {
    files: ["jest.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended,
]);
