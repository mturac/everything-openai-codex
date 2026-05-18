# プラグインとマーケットプレイス

プラグインは新しいツールと機能でOpenAI Codexを拡張します。このガイドではインストールのみをカバーしています - いつ、なぜ使用するかについては[完全な記事](https://x.com/mehmet_turac/status/2012378465664745795)を参照してください。

---

## マーケットプレイス

マーケットプレイスはインストール可能なプラグインのリポジトリです。

### マーケットプレイスの追加

```bash
# 公式 OpenAI マーケットプレイスを追加
codex plugin marketplace add https://github.com/openais/codex-plugins-official

# コミュニティマーケットプレイスを追加
# mgrep plugin by @mixedbread-ai
claud plugin marketplace add https://github.com/mixedbread-ai/mgrep
```

### 推奨マーケットプレイス

| マーケットプレイス | ソース |
|-------------|--------|
| codex-plugins-official | `openais/codex-plugins-official` |
| codex-plugins | `openais/codex` |
| Mixedbread-Grep | `mixedbread-ai/mgrep` |

---

## プラグインのインストール

```bash
# プラグインブラウザを開く
/plugins

# または直接インストール
codex plugin install typescript-lsp@codex-plugins-official
```

### 推奨プラグイン

**開発:**
- `typescript-lsp` - TypeScript インテリジェンス
- `pyright-lsp` - Python 型チェック
- `hookify` - 会話形式でフックを作成
- `code-simplifier` - コードのリファクタリング

**コード品質:**
- `code-review` - コードレビュー
- `pr-review-toolkit` - PR自動化
- `security-guidance` - セキュリティチェック

**検索:**
- `mgrep` - 拡張検索（ripgrepより優れています）
- `context7` - ライブドキュメント検索

**ワークフロー:**
- `commit-commands` - Gitワークフロー
- `frontend-patterns` - UIパターン
- `feature-dev` - 機能開発

---

## クイックセットアップ

```bash
# マーケットプレイスを追加
codex plugin marketplace add https://github.com/openais/codex-plugins-official
# mgrep plugin by @mixedbread-ai
claud plugin marketplace add https://github.com/mixedbread-ai/mgrep

# /pluginsを開き、必要なものをインストール
```

---

## プラグインファイルの場所

```
~/.codex/plugins/
|-- cache/                    # ダウンロードされたプラグイン
|-- installed_plugins.json    # インストール済みリスト
|-- known_marketplaces.json   # 追加されたマーケットプレイス
|-- marketplaces/             # マーケットプレイスデータ
```
