# Dark Mode Best Practices
##　参照
- [真にチラつかないダークモードをついに実現したぞ。実現方法と気付きを書く](https://blog.stin.ink/articles/how-to-implement-a-perfect-dark-mode)

## 概要
Reactでのダークモード実装に関するベストプラクティスをまとめいる

## ダークモードの実装方法
### 1. OSによるモード設定を反映する
メディアクエリー`@media (prefers-color-scheme: dark)`を使用して、ユーザーのOS設定に基づいてダークモードを適用する
JavaScriptで判定が必要な場合は`matchMedia("prefers-color-scheme: dark")`を使用する

### 2. 独自の設定値を持つ
OSの設定は使用せず、独自のデータを使う場合
CSSに反映するには、`data-color-mode="dark"の用にdata属性で設定値を与えておく
CSS側ではそのdata属性をセレクターとして、ダークモード用のスタイルを指定する

### 3. ２つのハイブリッド
OSの設定を反映するか、OSの設定を無視して強制的にダークモード、またはライトモードするか三択を提供する方法
指定された設定値は、LocalStorageなどに保存しておく
OSの設定を反映する場合は、`matchMedia("prefers-color-scheme: dark")`で判定し、html要素に`data-color-mode`属性を設定する。OSの設定を無視したモード選択なら、その選択値を`data-color-mode`属性に設定する

## ちらつき問題
2と3の場合、ブラウザでReactが動いてから設定値を反映できる
SSRの場合、サーバーサイドでHTMLが生成される檀家では属性を決定できない

## 解決策
### script要素の埋め込み
Reactアプリケーションがマウントされる前に、HTMLのhead内にscript要素を埋め込み、JavaScriptで`data-color-mode`属性を設定する
script要素は`defer`や`async`をつけない場合、HTMLを上から解釈しているブラウザに見つかった時点で実行され、その間はHTMLの解釈が停止する
初期表示を遅らせたり存在しないDOMアクセスによるエラーの原因になるので通常は避けるべきだが、逆に利用してhead要素に手書きのscriptを仕込むことで、bodyが解釈される前にhtml要素の`data-color-mode`属性が存在することを保証できる

例
```javascript
<script>
  (function () {
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const fromStorage = localStorage.getItem("stin-blog-color-mode");
    const colorMode: "light" | "dark" =
      fromStorage === "system" || fromStorage == null
        ? prefers
        : fromStorage === "light"
          ? "light"
          : "dark";
    window.document.documentElement.dataset.colorMode = colorMode;
  })();
</script>
```
Typescriptは使用できないので、JavaScriptに[トランスパイル](https://www.typescriptlang.org/play/?target=2#code/BQMwrgdgxgLglgewgAmASmQbwFDOVJAZxmQAcAnAUxEvMOQF5kB3OCAEwWYDoBbAQxhQAFgFlK7OP2AAiYBWq1CAWgIAbBOWWERlXpQBcydv3IBrNDLR9BuwrjzIA-MhknzMh3iMy1cAObCMDIA3A4EEMTIIOQIvADKMJr8-pSMyBpQ-GqJyancqTAAkjB6ssRsygBGGv6qCBpavAjslFZheBFR6pqiLYaufoHByAA+ru5mMoxeqDFxueQpaQyrroQAnsR606Pj8wlJS6mMTBBgamoYLgo0dMhGB4vLp0y+AUHTLu-D0z6ToQcrA4XG4nCgYH0EBgYIQEKhMAAomo9JRoWDBPxCJQYT1yH1Wuk8QTKGEAL5odAhIA)したうえで、[minify](https://blog.stin.ink/articles/how-to-implement-a-perfect-dark-mode#:~:text=%E3%81%AE%E5%87%BA%E5%8A%9B%E3%82%92-,Terser%20REPL,-%E3%81%A7minify%E3%81%97)を行って書き込む

minify結果を、`app/layout.tsx`などのルートレイアウトファイルのhead要素の`dangerouslySetInnerHTML`で埋め込む
```tsx
const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html suppressHydrationWarning lang="ja">
      <head>
        {/*
          TypeScript Playground: https://www.typescriptlang.org/play/?target=2#code/BQMwrgdgxgLglgewgAmASmQbwFDOVJAZxmQAcAnAUxEvMOQF5kB3OCAEwWYDoBbAQxhQAFgFlK7OP2AAiYBWq1CAWgIAbBOWWERlXpQBcydv3IBrNDLR9BuwrjzIA-MhknzMh3iMy1cAObCMDIA3A4EEMTIIOQIvADKMJr8-pSMyBpQ-GqJyancqTAAkjB6ssRsygBGGv6qCBpavAjslFZheBFR6pqiLYaufoHByAA+ru5mMoxeqDFxueQpaQyrroQAnsR606Pj8wlJS6mMTBBgamoYLgo0dMhGB4vLp0y+AUHTLu-D0z6ToQcrA4XG4nCgYH0EBgYIQEKhMAAomo9JRoWDBPxCJQYT1yH1Wuk8QTKGEAL5odAhIA
          Terser REPL: https://try.terser.org/
       */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){const e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",o=localStorage.getItem("stin-blog-color-mode"),t="system"===o||null==o?e:"light"===o?"light":"dark";window.document.documentElement.dataset.colorMode=t}();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
};

```

React管理外のスクリプトでHTMLを操作するので、サーバーサイドで生成されたHTMLとhydration実行時のHTMLで`data-color-mode`属性の値が異なる可能性がある
通常は異常事態となるが、この場合は`suppressHydrationWarning`属性をhtml要素に付与して、Reactのhydration時の警告を抑制する
