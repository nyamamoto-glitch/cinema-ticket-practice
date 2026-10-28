# テスト演習：さくらシネマ料金計算

架空の映画館のチケット料金計算機能を題材にした、ソフトウェアテストの演習教材です。

- 演習版の画面には8個のバグが仕込まれています
- 採点ツールにテストケース（CSV）を貼り付けると、バグを何個検出できるかを採点できます
- 人が設計したテストとAIが生成したテストを、同じ物差しで比較できます

## ファイル構成

```
index.html          演習トップ
app/                演習版（バグ入り）
correct/            正常版
checker/            採点ツール
docs/spec.md        仕様書
docs/ai-prompt.md   AIにテストを生成させるプロンプト
docs/answers.md     解答（バグ一覧）
assets/pricing.js   料金計算ロジック（バグはフラグで個別にON/OFF）
assets/app.js       画面の制御
assets/style.css    スタイル
```

## GitHub Pages での公開手順

1. GitHub で新しいリポジトリを作成します（Public）。
2. リポジトリの画面で **Add file → Upload files** を選び、このフォルダの中身をすべてドラッグ＆ドロップして **Commit changes** を押します。
   - フォルダごとドラッグすれば、フォルダ構成を保ったままアップロードされます。
3. **Settings → Pages** を開き、**Source** を「Deploy from a branch」、**Branch** を `main` ／ `/ (root)` にして **Save** を押します。
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます。

`docs/` の Markdown ファイル（`.md`）は、GitHub Pages が自動的に HTML（`.html`）に変換して公開します。

## ローカルで確認する場合

`index.html` をブラウザで直接開けば、演習版・正常版・採点ツールは動作します。
仕様書などの Markdown は HTML に変換されないため、GitHub 上で `docs/` のファイルを直接開いてください。

## バグの追加・変更

バグは `assets/pricing.js` の中で `bugs.B1` 〜 `bugs.B8` のフラグで切り替えています。
バグを追加する場合は、`BUG_IDS` に ID を追加し、計算処理の中に `bugs.B9` などの分岐を加え、`app/index.html` の `window.APP_BUGS` にも追加してください。
