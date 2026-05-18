#!/bin/bash
#
# ecc Trae Uninstaller
# Uninstalls Everything OpenAI Codex workflows from a Trae project.
#
# Usage:
#   ./uninstall.sh              # Uninstall from current directory
#   ./uninstall.sh ~            # Uninstall globally from ~/.trae/
#
# Environment:
#   TRAE_ENV=cn              # Force use .trae-cn directory
#

set -euo pipefail

# Resolve the directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Get the trae directory name (.trae or .trae-cn)
get_trae_dir() {
    # Check environment variable first
    if [ "${TRAE_ENV:-}" = "cn" ]; then
        echo ".trae-cn"
    else
        echo ".trae"
    fi
}

resolve_existing_path() {
    local file_path="$1"
    local dir_path
    local base_name

    dir_path="${file_path%/*}"
    base_name="${file_path##*/}"
    [ -d "$dir_path" ] || return 1

    (
        cd "$dir_path"
        printf '%s/%s\n' "$(pwd -P)" "$base_name"
    )
}

is_valid_manifest_entry() {
    local file_path="$1"

    case "$file_path" in
        ""|/*|~*|*/../*|../*|*/..|..)
            return 1
            ;;
    esac

    return 0
}

# Main uninstall function
do_uninstall() {
    local target_dir="$PWD"
    local trae_dir="$(get_trae_dir)"
    
    # Check if ~ was specified (or expanded to $HOME)
    if [ "$#" -ge 1 ]; then
        if [ "$1" = "~" ] || [ "$1" = "$HOME" ]; then
            target_dir="$HOME"
        fi
    fi
    
    # Check if we're already inside a .trae or .trae-cn directory
    local current_dir_name="$(basename "$target_dir")"
    local trae_full_path
    
    if [ "$current_dir_name" = ".trae" ] || [ "$current_dir_name" = ".trae-cn" ]; then
        # Already inside the trae directory, use it directly
        trae_full_path="$target_dir"
    else
        # Normal case: append trae_dir to target_dir
        trae_full_path="$target_dir/$trae_dir"
    fi
    
    echo "ecc Trae Uninstaller"
    echo "===================="
    echo ""
    echo "Target:  $trae_full_path/"
    echo ""
    
    if [ ! -d "$trae_full_path" ]; then
        echo "Error: $trae_dir directory not found at $target_dir"
        exit 1
    fi
    
    trae_root_resolved="$(cd "$trae_full_path" && pwd -P)"

    # Manifest file path
    MANIFEST="$trae_full_path/.ecc-manifest"
    
    if [ ! -f "$MANIFEST" ]; then
        echo "Warning: No manifest file found (.ecc-manifest)"
        echo ""
        echo "This could mean:"
        echo "  1. ecc was installed with an older version without manifest support"
        echo "  2. The manifest file was manually deleted"
        echo ""
        read -p "Do you want to remove the entire $trae_dir directory? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Uninstall cancelled."
            exit 0
        fi
        rm -rf "$trae_full_path"
        echo "Uninstall complete!"
        echo ""
        echo "Removed: $trae_full_path/"
        exit 0
    fi
    
    echo "Found manifest file - will only remove files installed by ecc"
    echo ""
    read -p "Are you sure you want to uninstall ecc from $trae_dir? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Uninstall cancelled."
        exit 0
    fi
    
    python3 - "$trae_full_path" "$MANIFEST" "$trae_dir" <<'PY'
import os
import shutil
import sys
from pathlib import Path

root = Path(sys.argv[1])
manifest = Path(sys.argv[2])
trae_dir = sys.argv[3]
root_resolved = root.resolve()

removed = 0
skipped = 0

def valid_entry(entry):
    if not entry or entry.startswith('/') or entry.startswith('~'):
        return False
    parts = Path(entry).parts
    return '..' not in parts

entries = [line.strip() for line in manifest.read_text(encoding='utf8').splitlines() if line.strip()]
if '.ecc-manifest' not in entries:
    entries.append('.ecc-manifest')

for entry in entries:
    if not valid_entry(entry):
        print(f"Skipped: {entry} (invalid manifest entry)")
        skipped += 1
        continue

    target = root / entry
    if not target.exists() and not target.is_symlink():
        skipped += 1
        continue

    try:
        resolved = target.resolve()
    except OSError:
        print(f"Skipped: {entry} (invalid manifest entry)")
        skipped += 1
        continue

    if resolved != root_resolved and root_resolved not in resolved.parents:
        print(f"Skipped: {entry} (invalid manifest entry)")
        skipped += 1
        continue

    try:
        if target.is_symlink() or target.is_file():
            target.unlink()
            removed += 1
        elif target.is_dir():
            target.rmdir()
            removed += 1
        else:
            skipped += 1
    except OSError:
        print(f"Skipped: {entry}/ (not empty - contains user files)")
        skipped += 1

if root.exists():
    for current_root, dirnames, _filenames in os.walk(root, topdown=False):
        current = Path(current_root)
        if current == root:
            continue
        try:
            current.rmdir()
            removed += 1
        except OSError:
            pass

if root.exists():
    try:
        root.rmdir()
        removed += 1
    except OSError:
        pass

print()
print("Uninstall complete!")
print()
print("Summary:")
print(f"  Removed: {removed} items")
print(f"  Skipped: {skipped} items (not found or user-modified)")
print()
if root.exists():
    print(f"Note: {trae_dir} directory still exists (contains user-added files)")
PY
}

# Execute uninstall
do_uninstall "$@"
