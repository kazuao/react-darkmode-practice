import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

// 追加プラグイン
import react from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import functional from "eslint-plugin-functional";
import unicorn from "eslint-plugin-unicorn";
import preferArrowFunctions from "eslint-plugin-prefer-arrow-functions";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-you-might-not-need-an-effect": reactYouMightNotNeedAnEffect,
      react,
      import: importPlugin,
      functional,
      unicorn,
      "prefer-arrow-functions": preferArrowFunctions,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // ====================================
      // react-you-might-not-need-an-effect
      // ====================================
      "react-you-might-not-need-an-effect/no-derived-state": "error",
      "react-you-might-not-need-an-effect/no-chain-state-updates": "error",
      "react-you-might-not-need-an-effect/no-event-handler": "error",
      "react-you-might-not-need-an-effect/no-adjust-state-on-prop-change": "error",
      "react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change": "error",
      "react-you-might-not-need-an-effect/no-pass-live-state-to-parent": "error",
      "react-you-might-not-need-an-effect/no-pass-data-to-parent": "error",
      "react-you-might-not-need-an-effect/no-pass-ref-to-parent": "error",
      "react-you-might-not-need-an-effect/no-initialize-state": "error",
      "react-you-might-not-need-an-effect/no-manage-parent": "error",
      "react-you-might-not-need-an-effect/no-empty-effect": "error",

      // ====================================
      // 型安全性
      // ====================================
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: true, // 文字列の暗黙チェックを許可
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: true, // nullable string も許可
        },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/restrict-plus-operands": [
        "error",
        {
          skipCompoundAssignments: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
          allowAny: false,
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: false,
          allowAny: false,
          allowNever: false,
          allowRegExp: false,
        },
      ],
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/require-array-sort-compare": ["error", { ignoreStringArrays: true }],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: true,
        },
      ],

      // ====================================
      // 暗黙の型変換禁止
      // ====================================
      "no-implicit-coercion": "error",
      "prefer-template": "error",
      "no-restricted-globals": [
        "error",
        "eval",
        "Function",
        { name: "isFinite", message: "Use Number.isFinite instead." },
        { name: "isNaN", message: "Use Number.isNaN instead." },
      ],

      // ====================================
      // React
      // ====================================
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary"] }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.property.name='useEffect'][arguments.length!=2]",
          message: "useEffect の第2引数（依存配列）は必須です",
        },
      ],

      // ====================================
      // import
      // ====================================
      "import/no-cycle": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],

      // ====================================
      // Mutation 禁止
      // ====================================
      "functional/no-let": [
        "error",
        {
          allowInForLoopInit: true,
          allowInFunctions: false,
          ignoreIdentifierPattern: ["^mut_", "^_mut_"],
        },
      ],
      "functional/immutable-data": [
        "error",
        {
          ignoreClasses: true,
          ignoreImmediateMutation: true,
          ignoreIdentifierPattern: ["^mut_", "^_mut_"],
          ignoreAccessorPattern: [
            "**.current.**",
            "**.displayName",
            "**.onload",
            "**.onerror",
            "**.onabort",
            "**.onprogress",
            "**.ondataavailable",
            "**.onstop",
            "**.onstart",
            "**.onpause",
            "**.onresume",
            "**.onended",
          ],
        },
      ],

      // ====================================
      // その他
      // ====================================
      "func-style": "error",
      "prefer-arrow-functions/prefer-arrow-functions": [
        "error",
        {
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: "unchanged",
          singleReturnOnly: false,
        },
      ],
      "unicorn/prefer-switch": "error",
    },
  },
  // ====================================
  // テストファイル用のオーバーライド
  // ====================================
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      // テストではモックの設定でミュータブルな操作が必要
      "functional/immutable-data": "off",
      "functional/no-let": "off",
      // テストでは Function 型のモックが必要な場合がある
      "no-restricted-globals": "off",
    },
  },
  // Prettier との競合を回避（必ず最後に配置）
  eslintConfigPrettier,
]);
