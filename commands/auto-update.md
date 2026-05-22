---
description: Pull the latest ecc repo changes and reinstall the current managed targets.
disable-model-invocation: true
---

# Auto Update

Update ecc from its upstream repo and regenerate the current context's managed install using the original install-state request.

## Usage

```bash
# Preview the update without mutating anything
ecc_ROOT="${CODEX_PLUGIN_ROOT:-$(node -e "var r=(()=>{var e=process.env.CODEX_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.codex'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;for(var s of [['eoc'],['eoc@eoc'],['marketplace','eoc'],['ecc'],['ecc@ecc'],['marketplace','ecc'],['Everything OpenAI Codex'],['Everything OpenAI Codex@Everything OpenAI Codex'],['marketplace','Everything OpenAI Codex']]){var l=p.join(d,'plugins',...s);if(f.existsSync(p.join(l,q)))return l}try{for(var g of ['eoc','ecc','Everything OpenAI Codex']){var b=p.join(d,'plugins','cache',g);for(var o of f.readdirSync(b,{withFileTypes:true})){if(!o.isDirectory())continue;for(var v of f.readdirSync(p.join(b,o.name),{withFileTypes:true})){if(!v.isDirectory())continue;var c=p.join(b,o.name,v.name);if(f.existsSync(p.join(c,q)))return c}}}}catch(x){}return d})();console.log(r)")}"
node "$ecc_ROOT/scripts/auto-update.js" --dry-run

# Update only Cursor-managed files in the current project
node "$ecc_ROOT/scripts/auto-update.js" --target cursor

# Override the ecc repo root explicitly
node "$ecc_ROOT/scripts/auto-update.js" --repo-root /path/to/Everything OpenAI Codex
```

## Notes

- This command uses the recorded install-state request and reruns `install-apply.js` after pulling the latest repo changes.
- Reinstall is intentional: it handles upstream renames and deletions that `repair.js` cannot safely reconstruct from stale operations alone.
- Use `--dry-run` first if you want to see the reconstructed reinstall plan before mutating anything.
