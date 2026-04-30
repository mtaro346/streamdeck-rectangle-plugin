# Stream Deck Rectangle Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![macOS](https://img.shields.io/badge/macOS-12%2B-blue)](https://www.apple.com/macos/)
[![Stream Deck SDK](https://img.shields.io/badge/Stream%20Deck-SDK%20v2-black)](https://docs.elgato.com/streamdeck/sdk/)
[![Unofficial](https://img.shields.io/badge/Status-Unofficial-orange)](#)

> ⚠️ **非公式プラグイン (Unofficial)** — このリポジトリは個人開発のサードパーティ製プラグインです。
> [Rectangle](https://rectangleapp.com/) 公式（Ryan Hanson 氏）および [Elgato](https://www.elgato.com/) 公式とは一切関係がありません。
> 不具合・要望は本リポジトリの Issue へお願いします（Rectangle / Elgato への問い合わせは無効です）。
>
> **Unofficial third-party plugin.** Not affiliated with, endorsed by, or supported by the Rectangle project (Ryan Hanson) or Elgato. Issues should be filed in this repository, not upstream.

[Rectangle.app](https://rectangleapp.com/) のウインドウ管理アクションを Stream Deck から呼び出すプラグイン。各アクションが `rectangle://execute-action?name=<name>` URL を `open -g` で発火する（フォアグラウンドを奪わずに Rectangle がサイレントに処理）。

## 提供アクション（28件）

| 区分 | アクション |
|---|---|
| 半分 | Left Half / Right Half / Top Half / Bottom Half |
| 四分割 | Top Left / Top Right / Bottom Left / Bottom Right |
| 三分割 | Left Third / Center Third / Right Third |
| 2/3 | Left Two-Thirds / Right Two-Thirds |
| **六分割（3×2）** | Top Left / Top Center / Top Right / Bottom Left / Bottom Center / Bottom Right Sixth |
| サイズ | Maximize / Almost Maximize / Center / Center Half / Restore / Larger / Smaller |
| ディスプレイ | Next Display / Previous Display |

各アクションのアイコンは `scripts/make-icons.mjs` がレイアウトを SVG で描画して PNG 化（青塗り＝ウインドウが入る領域）。

## 機能

- **ワンタップ**: キーを押すと割り当てたアクションを即実行
- **長押しに別アクション**: Property Inspector で「Long Press Action」を選ぶと、長押し（既定 500ms / 250–1500ms 可変）で別レイアウトを発動。アイコン右下に黄色のサブアイコンとドット三点が表示される
- **バッジ位置カスタム**: 長押しサブアイコンの表示位置（X/Y % 0–100）をスライダで自由配置。デフォルトは右下 (68%, 68%)
- **常駐リソースなし**: URL スキームを呼ぶだけなのでバックグラウンド常駐プロセスはゼロ。Rectangle 本体に処理を委譲

## ディレクトリ構成

```
src/
  plugin.ts                 エントリ（全アクション登録）
  config.ts                 アクション定義（UUID/名前/レイアウト）
  action.ts                 KeyDown→openRectangleAction の SingletonAction ファクトリ
  url-opener.ts             open -g rectangle://... を発行
com.asuka.rectangle.sdPlugin/
  manifest.json             Stream Deck 向け 22 Action 定義
  imgs/
    plugin/                 カテゴリ・マーケットプレイスアイコン
    actions/<name>/         icon.png(@2x) + key.png(@2x)
  bin/plugin.js             rollup 出力（コミットしない）
scripts/
  make-icons.mjs            SVG→PNG 一括生成（sips利用）
```

## セットアップ

```bash
npm install
npm run install:plugin
npm run icons          # アイコン未生成のとき
npm run build
npm run link           # 初回のみ：Stream Deck アプリへ登録
npm run restart
```

`Rectangle.app` を起動し、URL スキームの権限を許可しておくこと（初回 `open rectangle://execute-action?name=maximize` で確認ダイアログが出る）。

Stream Deck アプリの右サイドバーに **Rectangle** カテゴリが出るので、使いたいアクション（Left Half 等）をキーへドラッグするだけで完了。プロパティ設定不要。

## 開発

```bash
npm run watch          # watch + restart
npm run validate       # manifest 検証
npm run pack           # 配布用 .streamDeckPlugin を生成
```

## 既知の制約

- `Rectangle.app` がインストール・常駐していること（mas/Homebrew どちらでも可）
- ディスプレイをまたぐショートカット系（`next-display` 等）は Rectangle.app 側で対応する Action が有効になっている必要あり
- アクションを増やしたい場合は `src/config.ts` と `com.asuka.rectangle.sdPlugin/manifest.json` の両方に追記してから `npm run icons && npm run build && npm run restart`

## アクション追加の手順

新レイアウトを 1 件追加するときは以下 4 ファイルを揃える：

1. `src/config.ts` — `RectangleLayout` の union と `RECTANGLE_ACTIONS` 配列にエントリ追加
2. `src/icon.ts` — `fillRectForLayout` の switch に矩形定義を追加
3. `scripts/make-icons.mjs` — 同様に `ACTIONS` と `fillRectForLayout` を同期更新（SVG→PNG 生成側）
4. `com.asuka.rectangle.sdPlugin/manifest.json` — Stream Deck SDK 用の Action エントリ追加
5. Property Inspector の長押し選択肢にも入れたければ `com.asuka.rectangle.sdPlugin/ui/inspector.html` の `<option>` を追加

そのあと `npm run icons && npm run build && npm run validate && npm run pack` で配布パッケージまで生成。

## ライセンス

[MIT License](./LICENSE) — Copyright (c) 2026 asuka

## 関連リンク

- [Rectangle (oss app)](https://github.com/rxhanson/Rectangle) — 本プラグインが呼び出す URL スキームの提供元
- [Elgato Stream Deck SDK](https://docs.elgato.com/streamdeck/sdk/) — プラグイン開発リファレンス
