import js from "@eslint/js";
import turboPlugin from "eslint-plugin-turbo";
import * as tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 */
export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,ts,tsx,jsx}"],
    rules: {
      // Add prettier rules here instead of using eslint-config-prettier
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn"
    }
  },
  {
    plugins: {
      onlyWarn
    }
  },
  {
    ignores: [
      "node_modules/",
      "target/",
      ".next/",
      "build/",
      "dist/",
      "packages/eslint-plugin-turbo/__fixtures__",
      "packages/create-turbo/templates",
      "crates/*/tests/**",
      "crates/*/js/src/compiled"
    ]
  }
];
