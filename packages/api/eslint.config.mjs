import { defineConfig } from "eslint/config";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  {
    files: ["**/*.ts"],
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...compat.extends("plugin:@typescript-eslint/recommended")[0].rules,
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
