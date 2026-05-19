# セキュリティポリシー

## サポートバージョン

| バージョン | サポート状況 |
| ---------- | ------------ |
| 1.9.x      | :white_check_mark: |
| 1.8.x      | :white_check_mark: |
| < 1.8      | :x:                |

## 脆弱性の報告

eccでセキュリティ脆弱性を発見した場合は、責任ある方法で報告してください。

**セキュリティ脆弱性についてGitHubの公開Issueを作成しないでください。**

このリポジトリで GitHub private vulnerability reporting が利用できる場合は、そのフローを使用してください。GitHub にその選択肢が表示されない場合は、脆弱性の詳細を公開せずに <https://github.com/mturac> のメンテナープロフィールから連絡してください。以下を含めてください：

- 脆弱性の説明
- 再現手順
- 影響を受けるバージョン
- 潜在的な影響の評価

期待できること：

- 48時間以内に**確認**
- 7日以内に**状況の更新**
- 重大な問題については30日以内に**修正または緩和策**

脆弱性が受理された場合：

- リリースノートにクレジットを記載します（匿名を希望する場合を除く）
- 適時に問題を修正します
- 開示のタイミングをあなたと調整します

脆弱性が却下された場合は、その理由を説明し、他の場所への報告が必要かどうかについてガイダンスを提供します。

## 適用範囲

このポリシーの対象：

- eccプラグインおよびこのリポジトリ内のすべてのスクリプト
- あなたのマシンで実行されるフックスクリプト
- インストール/アンインストール/修復ライフサイクルスクリプト
- eccに同梱されるMCP設定

## 運用ガイダンス

### シークレットの取り扱い

`mcp-configs/mcp-servers.json` は**テンプレート**です。すべての `YOUR_*_HERE` の値はインストール時に環境変数またはシークレットマネージャーから置き換える必要があります。実際の認証情報を絶対にコミットしないでください。シークレットが誤ってコミットされた場合は、直ちにローテーションし履歴を書き換えてください。単純なリバートに依存しないでください。

ユーザースコープのOpenAI Codex設定（`~/.codex/settings.json` または `%USERPROFILE%\.codex\settings.json`）にも同じルールが適用されます。このファイルはこのリポジトリの外にありますが、`codex doctor` の出力、スクリーンショット、バグレポートを通じて共有されることがよくあります。PAT、APIキー、OAuthトークンを `mcpServers[*].env` ブロックにハードコードしないでください。MCPサーバーが既にサポートしているOSキーチェーンまたは環境変数からスポーン時に解決してください。クイック監査：

```bash
# macOS / Linux
grep -EnH '(TOKEN|SECRET|KEY|PASSWORD)\s*"\s*:\s*"[A-Za-z0-9_-]{16,}"' ~/.codex/settings.json
# Windows PowerShell
Select-String -Path "$env:USERPROFILE\.codex\settings.json" -Pattern '(TOKEN|SECRET|KEY|PASSWORD)"\s*:\s*"[A-Za-z0-9_-]{16,}"'
```

監査でマッチした場合は、発行プロバイダーでシークレットをローテーションし、ファイルから移動してください（プロバイダーごとの環境変数、またはサポートしているサーバーの `credentialHelper`）。

### ローカルMCPポート

同梱されているMCPサーバーの一部は、localhostポートへのプレーンHTTPで接続します（例：`devfleet` → `http://localhost:18801/mcp`）。初回使用前にリスニングプロセスを確認してください：

```bash
# Windows
netstat -ano | findstr :18801
# macOS / Linux
lsof -iTCP:18801 -sTCP:LISTEN
```

PIDを期待されるdevfleetバイナリと比較してください。そのポート上の他のプロセスはMCPトラフィックを傍受できます。

## トリアージ：疑わしい `<system-reminder>` ブロック

eccはOpenAI Codex内で実行され、モデルの入力に毎ターン**エフェメラルなクライアントサイドのシステムリマインダー**を注入します（TodoWriteのナッジ、日付変更通知、ファイル変更通知など）。これらのブロックは：

- 通常、*「該当しない場合は無視してください」*や*「このリマインダーをユーザーに言及しないでください」*のような表現で終わります。この文言はOpenAIのプロンプトであり、悪意のあるものではありません。
- CLIによってターンごとに追加され、`~/.codex/projects/<slug>/<sessionId>.jsonl` のセッション記録には**永続化されません**。

この組み合わせにより、ツール結果に追加されたプロンプトインジェクションと誤認しやすくなります。攻撃として扱う前に確認してください：

1. そのブロックは実際にこのリポジトリ配下のファイルにありますか？ `grep -rEn "system-reminder|NEVER mention|DO NOT mention" .`；何もなければ、リポジトリによって運ばれたものではありません。
2. そのブロックは記録に保存されていますか？ 現在のセッションの `.jsonl` を検査してください。正確なテキストが `tool_result` 本文内に表示されない場合、それはクライアント注入のエフェメラルリマインダーであり、ツールからのペイロードではありません。
3. その内容はOpenAIの既知のリマインダー（TodoWriteナッジ、日付変更、ファイル変更通知）と文脈的に一致していますか？ はいの場合、それはエフェメラルリマインダーメカニズムであり、対処は不要です。

ブロックが**(a)** 記録の `tool_result` 内に存在し、**かつ (b)** 実際に読み取られたファイルまたはURLに帰属できない場合にのみOpenAIにエスカレーションしてください。最小限のレポート：新しいセッション、クリーンなローカルファイルの読み取り、観察された正確なテキスト、記録の抜粋。<https://github.com/openais/codex/issues>（非機密）または <mailto:security@openai.com>（エンバーゴクラス）に送信してください。

エフェメラルリマインダーに応じてリポジトリファイルをサニタイズしないでください。それらはキャリアではありません。

## セキュリティリソース

- **セキュリティガイド**: [The Shorthand Guide to Everything Agentic Security](./the-security-guide.md)
- **サプライチェーンインシデント対応**: [npm/GitHub Actions package-registry playbook](../security/supply-chain-incident-response.md)
- **OWASP MCP Top 10**: [owasp.org/www-project-mcp-top-10](https://owasp.org/www-project-mcp-top-10/)
- **OWASP Agentic Applications Top 10**: [genai.owasp.org](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
