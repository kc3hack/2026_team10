# フロントエンド現状まとめ

最終更新: 2026-02-20

## 1. 概要

- フレームワーク: React + TypeScript + Vite
- ルーティング: `react-router-dom`（`/` と `/solo` の2画面）
- UIライブラリ: MUI（一部ボタンとアイコン）
- アニメーション: `react-confetti`
- API呼び出し: `fetch`（Vite proxy 経由で `/api` をバックエンド `http://localhost:8080` に転送）

現状は「タイトル画面 -> ソロゲーム画面 -> 正解演出 -> 結果オーバーレイ」までが主フローとして実装済みです。

## 2. ディレクトリと責務

| パス                                                | 役割                                                           |
| --------------------------------------------------- | -------------------------------------------------------------- |
| `frontend/src/main.tsx`                             | ルート設定（`/` と `/solo`）                                   |
| `frontend/src/App.tsx`                              | タイトル画面                                                   |
| `frontend/src/Solo/index.tsx`                       | ソロゲーム本体（ヒント表示、回答送信、タイマー、結果表示制御） |
| `frontend/src/Solo/Components/MessageBubble.tsx`    | チャット吹き出し表示                                           |
| `frontend/src/Solo/Components/InputArea.tsx`        | 回答入力欄と送信ボタン                                         |
| `frontend/src/Solo/Components/Timer.tsx`            | 次ヒントまでの残り秒数表示                                     |
| `frontend/src/Result/Components/ThanksConfetti.tsx` | 正解演出（紙吹雪 + 「正解」テキスト）                          |
| `frontend/src/Result/Components/ResultOverlay.tsx`  | 結果オーバーレイ（閉じる、タイトル戻る、SNS、リトライ）        |
| `frontend/src/Result/Components/ResultButtons.tsx`  | 結果画面の3ボタン                                              |
| `frontend/vite.config.ts`                           | `/api` プロキシ設定                                            |
| `frontend/src/**/*.css`                             | 画面/部品ごとのスタイル                                        |

## 3. 画面ごとの実装

### 3.1 タイトル画面（`/`）

対象: `frontend/src/App.tsx`

- タイトル表示: `偏見で遊ぼう（仮）`
- `スタート`: `navigate("/solo")` でゲーム開始画面へ遷移
- `共有されたストーリーを見る`: クリック処理未実装（見た目のみ）

### 3.2 ソロ画面（`/solo`）

対象: `frontend/src/Solo/index.tsx`

### 初期化処理

- 初回表示時に `POST /api/solo` を呼び出し
- レスポンスの `result.id` を `gameId` に保存
- `result.hints` を `hints` に保存
- 最初のヒントだけ即時で `messages` に追加
- `hasFetchedData`（`useRef`）で二重取得防止
  （React StrictMode 下で `useEffect` が2回走る開発時挙動に対応）

### ヒント表示とタイマー

- ヒント2件目以降は 10秒ごとに `setTimeout` で順次表示
- 残り時間は `setInterval` で 1秒ごとに減算
- 次ヒント表示時に `timeLeft` を実質リセット
- 最終ヒント表示後は `timeLeft` を 0 に固定

### 入力と回答判定

- `InputArea` で文字入力 + Enter/送信ボタンで `handleSubmit`
- 送信時はまずユーザー発言をチャットに追加
- その後 `POST /api/solo/{gameId}/answer` で判定
- 判定結果に応じてシステム発言を追加
- 正解時: `hasAnswered = true` にしてタイマーと入力欄を停止

### 結果表示

- 正解時に `ThanksConfetti`（演出）を表示
- 演出完了後に `ResultOverlay` を表示（遷移済み）
- `ResultOverlay` 側のボタン仕様:
- タイトルに戻る: 実装済み（`/` へ遷移）
- SNS: `alert` のみ（未実装）
- もう一度遊ぶ: `alert` のみ（未実装）

### スクロール制御

- メッセージ領域が最下部付近にある時のみ、自動スクロールを実行
- ユーザーが過去メッセージを読んでいるときは強制スクロールしない

## 4. API連携の現状

- 実際に呼んでいるエンドポイント:
- `POST /api/solo`
- `POST /api/solo/:id/answer`

- Vite の proxy 設定:
- フロントからは `/api/...` を呼ぶ
- 開発サーバーが `/api` を外して `http://localhost:8080/...` に転送

- まだ未使用のAPI（`docs/api.md` に記載あり）:
- `GET /solo/:id/answer`（ギブアップ）
- `GET /solo/board/:id`（終了ラウンド詳細）

## 5. 状態管理（`Solo`）

`frontend/src/Solo/index.tsx` で `useState` 管理している主な状態:

| State               | 用途                                           |
| ------------------- | ---------------------------------------------- |
| `messages`          | チャット表示内容（ヒント/回答/判定メッセージ） |
| `hints`             | バックエンドから受け取るヒント配列             |
| `gameId`            | 回答判定APIに使うラウンドID                    |
| `inputValue`        | 入力欄の現在値                                 |
| `timeLeft`          | 次ヒントまでの残り秒数                         |
| `hasAnswered`       | 正解済みかどうか（UI停止条件）                 |
| `showResultOverlay` | 結果オーバーレイ表示制御                       |
| `animationFinished` | 演出完了フラグ                                 |
| `isLoading`         | 初期ロード中表示フラグ                         |

補助的な `useRef`:

- `messagesAreaRef`: メッセージ領域DOM参照
- `isAtBottomRef`: 自動スクロール可否判定
- `hasFetchedData`: 初回APIの重複呼び出し防止

## 6. スタイルの現状

- CSS はコンポーネント単位で分割（`App.css`, `Solo.css`, `Result.css`, 各部品CSS）
- タイトル画面: モバイルファーストの中央寄せ
- ソロ画面: 上部タイマー + 中央チャット + 下部入力の3層構成
- 吹き出し: システム左寄せ / ユーザー右寄せ
- 結果画面: 全画面オーバーレイ + 紙吹雪 + 3アクションボタン

## 7. 依存関係・開発設定

`frontend/package.json` より:

- 主な依存:
- `react`, `react-dom`, `react-router-dom`
- `@mui/material`, `@mui/icons-material`, `@emotion/*`
- `react-confetti`, `react-use`

- 主なスクリプト:
- `npm run dev`: 開発サーバー起動
- `npm run build`: 型チェック + 本番ビルド
- `npm run lint`: ESLint実行
- `npm run preview`: ビルド結果の確認

## 8. 実装上の注意点・未実装点

現時点で読み取れる課題/未完了項目:

1. タイトル画面の「共有されたストーリーを見る」は未接続。
2. 結果画面の `SNS` / `もう一度遊ぶ` は `alert` の仮実装。
3. ギブアップAPI・ボードAPIは未使用。
4. `ResultOverlay` の Escape キー処理は `onClose` を呼び出さない書き方になっている（参照のみ）。
5. APIエラー時は `console.error` のみで、ユーザー向けエラーUIは未実装。
6. `MessageBubble` のデフォルトアイコンが外部URL依存。

## 9. 現在のユーザーフロー（実装ベース）

1. `/` で「スタート」を押す
2. `/solo` でゲーム開始API実行
3. ヒントが10秒ごとに増える
4. ユーザーが回答送信
5. 正解なら演出（`ThanksConfetti`）表示
6. 結果オーバーレイ（`ResultOverlay`）を表示

## 10. ビルド確認（2026-02-20時点）

`frontend` で `npm run build` を実行した結果、以下で失敗することを確認:

- `src/Solo/index.tsx:170`
  `ThanksConfetti` に `onClose` props を渡しているが、`ThanksConfetti` 側で props 定義がないため型エラー。
