---
description: 最新のeccリポジトリ変更をプルし、現在の管理対象ターゲットを再インストールします。
disable-model-invocation: true
---

# 自動更新

eccをアップストリームリポジトリから更新し、元のインストール状態リクエストを使用して現在のコンテキストの管理対象インストールを再生成します。

## 使い方

```bash
# 何も変更せずに更新をプレビュー
ecc_ROOT="${CODEX_PLUGIN_ROOT:-$(node -e "var r=(()=>{var e=process.env.CODEX_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.codex'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;for(var s of [['ecc'],['ecc@ecc'],['marketplace','ecc'],['Everything OpenAI Codex'],['Everything OpenAI Codex@Everything OpenAI Codex'],['marketplace','Everything OpenAI Codex']]){var l=p.join(d,'plugins',...s);if(f.existsSync(p.join(l,q)))return l}try{for(var g of ['ecc','Everything OpenAI Codex']){var b=p.join(d,'plugins','cache',g);for(var o of f.readdirSync(b,{withFileTypes:true})){if(!o.isDirectory())continue;for(var v of f.readdirSync(p.join(b,o.name),{withFileTypes:true})){if(!v.isDirectory())continue;var c=p.join(b,o.name,v.name);if(f.existsSync(p.join(c,q)))return c}}}}catch(x){}return d})();console.log(r)")}"
node "$ecc_ROOT/scripts/auto-update.js" --dry-run

# 現在のプロジェクトのCursor管理ファイルのみ更新
node "$ecc_ROOT/scripts/auto-update.js" --target cursor

# eccリポジトリルートを明示的に上書き
node "$ecc_ROOT/scripts/auto-update.js" --repo-root /path/to/Everything OpenAI Codex
```

## ノート

- このコマンドは記録されたインストール状態リクエストを使用し、最新のリポジトリ変更をプルした後に`install-apply.js`を再実行します。
- 再インストールは意図的です: `repair.js`が古い操作から安全に再構築できないアップストリームの名前変更や削除を処理します。
- 何も変更する前に再構築された再インストール計画を確認したい場合は、先に`--dry-run`を使用してください。
