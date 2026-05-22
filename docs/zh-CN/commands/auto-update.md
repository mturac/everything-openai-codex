---
description: 拉取最新的ecc仓库更改并重新安装当前管理的目标。
disable-model-invocation: true
---

# 自动更新

从其上游仓库更新 ecc，并使用原始的安装状态请求重新生成当前上下文的受管安装。

## 用法

```bash
# Preview the update without mutating anything
ecc_ROOT="${CODEX_PLUGIN_ROOT:-$(node -e "var r=(()=>{var e=process.env.CODEX_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.codex'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;for(var s of [['eoc'],['eoc@eoc'],['marketplace','eoc'],['ecc'],['ecc@ecc'],['marketplace','ecc'],['Everything OpenAI Codex'],['Everything OpenAI Codex@Everything OpenAI Codex'],['marketplace','Everything OpenAI Codex']]){var l=p.join(d,'plugins',...s);if(f.existsSync(p.join(l,q)))return l}try{for(var g of ['eoc','ecc','Everything OpenAI Codex']){var b=p.join(d,'plugins','cache',g);for(var o of f.readdirSync(b,{withFileTypes:true})){if(!o.isDirectory())continue;for(var v of f.readdirSync(p.join(b,o.name),{withFileTypes:true})){if(!v.isDirectory())continue;var c=p.join(b,o.name,v.name);if(f.existsSync(p.join(c,q)))return c}}}}catch(x){}return d})();console.log(r)")}"
node "$ecc_ROOT/scripts/auto-update.js" --dry-run

# Update only Cursor-managed files in the current project
node "$ecc_ROOT/scripts/auto-update.js" --target cursor

# Override the ecc repo root explicitly
node "$ecc_ROOT/scripts/auto-update.js" --repo-root /path/to/Everything OpenAI Codex
```

## 说明

* 此命令使用记录的安装状态请求，在拉取最新仓库更改后重新运行 `install-apply.js`。
* 重新安装是必要的：它能处理上游的重命名和删除操作，而 `repair.js` 无法仅通过过时的操作安全地重建这些更改。
* 如需在修改前查看重建的重新安装计划，请先使用 `--dry-run`。
