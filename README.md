# React + TypeScript + Vite + Tailwind CSS v4 Boilerplate

これは、モダンなフロントエンド開発のための最強のスターターテンプレートです。
GitHubの「Template repository」機能を使って、この構成から素早く新しいプロジェクトを開始できます。

## 🚀 特徴 (Tech Stack)

- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/) (高速ビルド)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first configuration, Zero-runtime)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Linting & Formatting:**
  - [ESLint](https://eslint.org/) (Flat Config)
  - [Prettier](https://prettier.io/)
  - `prettier-plugin-tailwindcss` (クラス名の自動ソート)
- **Configuration:**
  - Path Alias 設定済み (`@/` = `src/`)

## 🛠️ 必須要件

- Node.js (LTS推奨)
- pnpm

## 📦 プロジェクトの始め方

### 1. このテンプレートからプロジェクトを作成

GitHubリポジトリ右上の **"Use this template"** ボタンをクリックし、**"Create a new repository"** を選択して新しいリポジトリを作成してください。

### 2. クローンとセットアップ

```bash
# 作成したリポジトリをクローン
git clone https://github.com/your-username/your-new-project.git
cd your-new-project

# 依存関係のインストール
pnpm install
```

### 3. プロジェクト情報の更新（重要）

`package.json` を開き、プロジェクト名を変更してください。

```json
{
  "name": "your-project-name", // ←ここを変更
  "version": "0.0.0",
  ...
}
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開いて確認します。

## 📜 利用可能なスクリプト

| コマンド       | 説明                                         |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | 開発サーバーを起動します (HMR有効)           |
| `pnpm build`   | 本番用にビルドします                         |
| `pnpm preview` | ビルドした成果物をローカルでプレビューします |
| `pnpm lint`    | ESLintを実行してコードの問題をチェックします |
| `pnpm format`  | Prettierを実行してコードを整形します         |

※ コミット時 (`git commit`) に、変更されたファイルに対して自動的に `lint` と `format` が実行されます。エラーがある場合、コミットは中断されます。

## 📂 ディレクトリ構成

```text
.
├── public/              # 静的アセット
├── src/
│   ├── assets/          # 画像などのアセット
│   ├── components/      # Reactコンポーネント
│   ├── App.tsx          # メインコンポーネント
│   ├── index.css        # Tailwind v4 インポート記述 (@import "tailwindcss";)
│   ├── main.tsx         # エントリーポイント
│   └── vite-env.d.ts    # Viteの型定義
├── .prettierrc          # Prettier設定
├── eslint.config.js     # ESLint設定
├── index.html           # HTMLエントリーポイント
├── package.json         # 依存関係とスクリプト
├── pnpm-lock.yaml       # ロックファイル
├── tsconfig.json        # TypeScript設定
└── vite.config.ts       # Vite設定 (Tailwindプラグイン, Alias設定)
```

## 🎨 Tailwind CSS v4 の使い方

Tailwind v4では `tailwind.config.js` は不要です。
CSS変数のカスタマイズなどは `src/index.css` 内で標準的なCSS構文を使って行います。

```css
@import 'tailwindcss';

@theme {
  --font-display: 'Satoshi', 'sans-serif';
  --breakpoint-3xl: 1920px;
  --color-avocado-100: oklch(0.99 0.03 132.75);
  --color-avocado-500: oklch(0.84 0.18 117.33);
}
```

詳細は [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs) を参照してください。

---

Happy Coding! 🚀
