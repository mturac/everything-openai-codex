# トラブルシューティングガイド

Everything OpenAI Codex (ecc) プラグインの一般的な問題と解決策。

## 目次

- [メモリとコンテキストの問題](#メモリとコンテキストの問題)
- [エージェントハーネスの障害](#エージェントハーネスの障害)
- [フックとワークフローのエラー](#フックとワークフローのエラー)
- [インストールとセットアップ](#インストールとセットアップ)
- [パフォーマンスの問題](#パフォーマンスの問題)
- [一般的なエラーメッセージ](#一般的なエラーメッセージ)
- [ヘルプを得る](#ヘルプを得る)

---

## メモリとコンテキストの問題

### コンテキストウィンドウのオーバーフロー

**症状：** 「Context too long」エラーまたは不完全なレスポンス

**原因：**
- トークン制限を超える大きなファイルのアップロード
- 蓄積された会話履歴
- 単一セッション内の複数の大きなツール出力

**解決策：**
```bash
# 1. 会話履歴をクリアして新しく開始
# OpenAI Codex: 「New Chat」または Cmd/Ctrl+Shift+N

# 2. 分析前にファイルサイズを縮小
head -n 100 large-file.log > sample.log

# 3. 大きな出力にはストリーミングを使用
head -n 50 large-file.txt

# 4. タスクを小さなチャンクに分割
# 代わりに: 「50ファイルすべてを分析して」
# 使用: 「src/components/ ディレクトリのファイルを分析して」
```

### メモリ永続化の失敗

**症状：** エージェントが以前のコンテキストや観測を覚えていない

**原因：**
- 継続学習フックが無効化されている
- 観測ファイルが破損している
- プロジェクト検出の失敗

**解決策：**
```bash
# 観測が記録されているか確認
ls ~/.codex/homunculus/projects/*/observations.jsonl

# 現在のプロジェクトのハッシュIDを検索
python3 - <<'PY'
import json, os
registry_path = os.path.expanduser("~/.codex/homunculus/projects.json")
with open(registry_path) as f:
    registry = json.load(f)
for project_id, meta in registry.items():
    if meta.get("root") == os.getcwd():
        print(project_id)
        break
else:
    raise SystemExit("Project hash not found in ~/.codex/homunculus/projects.json")
PY

# そのプロジェクトの最近の観測を表示
tail -20 ~/.codex/homunculus/projects/<project-hash>/observations.jsonl

# 破損した観測ファイルを再作成前にバックアップ
mv ~/.codex/homunculus/projects/<project-hash>/observations.jsonl \
  ~/.codex/homunculus/projects/<project-hash>/observations.jsonl.bak.$(date +%Y%m%d-%H%M%S)

# フックが有効か確認
grep -r "observe" ~/.codex/settings.json
```

---

## エージェントハーネスの障害

### エージェントが見つからない

**症状：** 「Agent not loaded」または「Unknown agent」エラー

**原因：**
- プラグインが正しくインストールされていない
- エージェントパスの設定ミス
- Marketplaceと手動インストールの不一致

**解決策：**
```bash
# プラグインのインストールを確認
ls ~/.codex/plugins/cache/

# エージェントの存在を確認（Marketplaceインストール）
ls ~/.codex/plugins/cache/*/agents/

# 手動インストールの場合、エージェントは以下に配置:
ls ~/.codex/agents/  # カスタムエージェントのみ

# プラグインをリロード
# OpenAI Codex → Settings → Extensions → Reload
```

### ワークフロー実行のハング

**症状：** エージェントが開始するが完了しない

**原因：**
- エージェントロジック内の無限ループ
- ユーザー入力でブロックされている
- API待ちのネットワークタイムアウト

**解決策：**
```bash
# 1. スタックしたプロセスを確認
ps aux | grep codex|ps aux | grep codex

# 2. デバッグモードを有効化
export CODEX_DEBUG=1

# 3. より短いタイムアウトを設定
export CODEX_TIMEOUT=30

# 4. ネットワーク接続を確認
curl -I https://api.openai.com
```

### ツール使用エラー

**症状：** 「Tool execution failed」またはパーミッション拒否

**原因：**
- 必要な依存関係の不足（npm、python等）
- ファイルパーミッションの不足
- パスが見つからない

**解決策：**
```bash
# 必要なツールがインストールされているか確認
which node python3 npm git

# フックスクリプトのパーミッションを修正
chmod +x ~/.codex/plugins/cache/*/hooks/*.sh
chmod +x ~/.codex/plugins/cache/*/skills/*/hooks/*.sh

# PATHに必要なバイナリが含まれているか確認
echo $PATH
```

---

## フックとワークフローのエラー

### フックが発火しない

**症状：** Pre/Postフックが実行されない

**原因：**
- フックがsettings.jsonに登録されていない
- 無効なフック構文
- フックスクリプトが実行可能でない

**解決策：**
```bash
# フックが登録されているか確認
grep -A 10 '"hooks"' ~/.codex/settings.json

# フックファイルが存在し実行可能か確認
ls -la ~/.codex/plugins/cache/*/hooks/

# フックを手動でテスト
bash ~/.codex/plugins/cache/*/hooks/pre-bash.sh <<< '{"command":"echo test"}'

# フックを再登録（プラグイン使用時）
# OpenAI Codex設定でプラグインを無効化してから再度有効化
```

### Python/Nodeバージョンの不一致

**症状：** 「python3 not found」または「node: command not found」

**原因：**
- Python/Nodeがインストールされていない
- PATHが設定されていない
- 間違ったPythonバージョン（Windows）

**解決策：**
```bash
# Python 3をインストール（不足している場合）
# macOS: brew install python3
# Ubuntu: sudo apt install python3
# Windows: python.orgからダウンロード

# Node.jsをインストール（不足している場合）
# macOS: brew install node
# Ubuntu: sudo apt install nodejs npm
# Windows: nodejs.orgからダウンロード

# インストールを確認
python3 --version
node --version
npm --version

# Windows: python3ではなくpythonが動作することを確認
python --version
```

### 開発サーバーブロッカーの誤検出

**症状：** フックが「dev」を含む正当なコマンドをブロックする

**原因：**
- ヒアドキュメントの内容がパターンマッチをトリガー
- 引数に「dev」を含む非開発コマンド

**解決策：**
```bash
# v1.8.0+で修正済み（PR #371）
# プラグインを最新バージョンにアップグレード

# 回避策: 開発サーバーをtmuxでラップ
tmux new-session -d -s dev "npm run dev"
tmux attach -t dev

# 必要に応じてフックを一時的に無効化
# ~/.codex/settings.jsonを編集してpre-bashフックを削除
```

---

## インストールとセットアップ

### プラグインが読み込まれない

**症状：** インストール後にプラグイン機能が利用できない

**原因：**
- Marketplaceキャッシュが更新されていない
- OpenAI Codexバージョンの非互換性
- プラグインファイルの破損
- ローカルのCodex設定がワイプまたはリセットされた

**解決策：**
```bash
# まずeccがこのマシンについて認識している情報を確認
ecc list-installed
ecc doctor
ecc repair

# doctor/repairで不足ファイルを復元できない場合のみ再インストール

# 変更前にプラグインキャッシュを確認
ls -la ~/.codex/plugins/cache/

# プラグインキャッシュを削除せずバックアップ
mv ~/.codex/plugins/cache ~/.codex/plugins/cache.backup.$(date +%Y%m%d-%H%M%S)
mkdir -p ~/.codex/plugins/cache

# Marketplaceから再インストール
# OpenAI Codex → Extensions → Everything OpenAI Codex → Uninstall
# その後Marketplaceから再インストール

# 問題がMarketplace/アカウントアクセスの場合、ecc Toolsのbilling/アカウントリカバリーを別途使用
# 再インストールをアカウントリカバリーの代替として使用しない

# OpenAI Codexバージョンを確認
codex --version
# OpenAI Codex 2.0+が必要

# 手動インストール（Marketplaceが失敗する場合）
git clone https://github.com/mturac/everything-openai-codex.git
cp -r Everything OpenAI Codex ~/.codex/plugins/ecc
```

### パッケージマネージャー検出の失敗

**症状：** 間違ったパッケージマネージャーが使用される（pnpmの代わりにnpm）

**原因：**
- ロックファイルが存在しない
- CODEX_PACKAGE_MANAGERが設定されていない
- 複数のロックファイルが検出を混乱させている

**解決策：**
```bash
# 優先パッケージマネージャーをグローバルに設定
export CODEX_PACKAGE_MANAGER=pnpm
# ~/.bashrcまたは~/.zshrcに追加

# またはプロジェクトごとに設定
echo '{"packageManager": "pnpm"}' > .codex/package-manager.json

# またはpackage.jsonフィールドを使用
npm pkg set packageManager="pnpm@8.15.0"

# 警告: ロックファイルの削除はインストールされた依存関係のバージョンを変更する可能性がある
# まずロックファイルをコミットまたはバックアップし、フレッシュインストールを実行してCIを再実行
# パッケージマネージャーを意図的に切り替える場合のみ実行
rm package-lock.json  # pnpm/yarn/bunを使用する場合
```

---

## パフォーマンスの問題

### レスポンスの遅延

**症状：** エージェントの応答に30秒以上かかる

**原因：**
- 大きな観測ファイル
- アクティブなフックが多すぎる
- APIへのネットワーク遅延

**解決策：**
```bash
# 大きな観測を削除せずアーカイブ
archive_dir="$HOME/.codex/homunculus/archive/$(date +%Y%m%d)"
mkdir -p "$archive_dir"
find ~/.codex/homunculus/projects -name "observations.jsonl" -size +10M -exec sh -c '
  for file do
    base=$(basename "$(dirname "$file")")
    gzip -c "$file" > "'"$archive_dir"'/${base}-observations.jsonl.gz"
    : > "$file"
  done
' sh {} +

# 未使用のフックを一時的に無効化
# ~/.codex/settings.jsonを編集

# アクティブな観測ファイルを小さく保つ
# 大きなアーカイブは ~/.codex/homunculus/archive/ に配置
```

### 高CPU使用率

**症状：** OpenAI CodexがCPUを100%消費

**原因：**
- 無限の観測ループ
- 大きなディレクトリのファイル監視
- フック内のメモリリーク

**解決策：**
```bash
# 暴走プロセスを確認
top -o cpu | grep codex|ps aux | grep codex

# 継続学習を一時的に無効化
touch ~/.codex/homunculus/disabled

# OpenAI Codexを再起動
# Cmd/Ctrl+Q で終了後、再起動

# 観測ファイルのサイズを確認
du -sh ~/.codex/homunculus/*/
```

---

## 一般的なエラーメッセージ

### "EACCES: permission denied"

```bash
# フックのパーミッションを修正
find ~/.codex/plugins -name "*.sh" -exec chmod +x {} \;

# 観測ディレクトリのパーミッションを修正
chmod -R u+rwX,go+rX ~/.codex/homunculus
```

### "MODULE_NOT_FOUND"

```bash
# プラグインの依存関係をインストール
cd ~/.codex/plugins/cache/ecc
npm install

# または手動インストールの場合
cd ~/.codex/plugins/ecc
npm install
```

### "spawn UNKNOWN"

```bash
# Windows固有: スクリプトが正しい改行コードを使用していることを確認
# CRLFをLFに変換
find ~/.codex/plugins -name "*.sh" -exec dos2unix {} \;

# またはdos2unixをインストール
# macOS: brew install dos2unix
# Ubuntu: sudo apt install dos2unix
```

---

## ヘルプを得る

問題が解決しない場合：

1. **GitHub Issuesを確認**: [github.com/mturac/everything-openai-codex/issues](https://github.com/mturac/everything-openai-codex/issues)
2. **デバッグログを有効化**:
   ```bash
   export CODEX_DEBUG=1
   export CODEX_LOG_LEVEL=debug
   ```
3. **診断情報を収集**:
   ```bash
   codex --version
   node --version
   python3 --version
   echo $CODEX_PACKAGE_MANAGER
   ls -la ~/.codex/plugins/cache/
   ```
4. **Issueを作成**: デバッグログ、エラーメッセージ、診断情報を含めてください

---

## 関連ドキュメント

- [README.md](./README.md) - インストールと機能
- [CONTRIBUTING.md](./CONTRIBUTING.md) - 開発ガイドライン
- [docs/](./) - 詳細なドキュメント
- [examples/](./examples/) - 使用例
