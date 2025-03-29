import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".cache/**",
      ".eslintrc.cjs",
      "eslint.config.js"
    ]
  },
  
  // Base config for all files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        process: "readonly",
        React: "writable",
        ActionFunctionArgs: "readonly",
        LoaderFunctionArgs: "readonly",
        User: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
  
  // React config
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react": reactPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
    rules: {
      ...compat.extends(
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended"
      )[0].rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off", // Not needed in React 17+ and with JSX transform
    },
  },
  
  // TypeScript config
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "import": importPlugin,
    },
    settings: {
      "import/internal-regex": "^~/",
      "import/resolver": {
        node: {
          extensions: [".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...compat.extends(
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript"
      )[0].rules,
      "import/no-unresolved": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    },
  },
  
  // Node environment for config files
  {
    files: ["*.config.js", "*.config.mjs", "*.config.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  
  // Test files
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "**/test/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
