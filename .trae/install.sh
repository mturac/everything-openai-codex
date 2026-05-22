#!/bin/bash
#
# ecc Trae Installer
# Installs Everything OpenAI Codex workflows into a Trae project.
#
# Usage:
#   ./install.sh              # Install to current directory
#   ./install.sh ~            # Install globally to ~/.trae/ or ~/.trae-cn/
#
# Environment:
#   TRAE_ENV=cn              # Force use .trae-cn directory
#

set -euo pipefail

# When globs match nothing, expand to empty list instead of the literal pattern
shopt -s nullglob

# Resolve the directory where this script lives (the repo root)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Get the trae directory name (.trae or .trae-cn)
get_trae_dir() {
    if [ "${TRAE_ENV:-}" = "cn" ]; then
        echo ".trae-cn"
    else
        echo ".trae"
    fi
}

ensure_manifest_entry() {
    local manifest="$1"
    local entry="$2"

    [ -f "$manifest" ] || : > "$manifest"
    if ! grep -Fqx "$entry" "$manifest"; then
        echo "$entry" >> "$manifest"
    fi
}

append_manifest_entry() {
    local manifest="$1"
    local entry="$2"

    [ -f "$manifest" ] || : > "$manifest"
    echo "$entry" >> "$manifest"
}

manifest_has_entry() {
    local manifest="$1"
    local entry="$2"

    [ -f "$manifest" ] && grep -Fqx "$entry" "$manifest"
}

copy_managed_file() {
    local source_path="$1"
    local target_path="$2"
    local manifest="$3"
    local manifest_entry="$4"
    local make_executable="${5:-0}"

    if [ -f "$target_path" ]; then
        return 1
    fi

    # Copy file contents instead of using cp. On macOS, cp can spend a long
    # time copying extended attributes from this repo's downloaded skill files,
    # which made the Trae smoke test flaky under the full suite. Trae only needs
    # the payload bytes here; executable bits are applied explicitly below.
    cat "$source_path" > "$target_path"
    if [ "$make_executable" -eq 1 ]; then
        chmod +x "$target_path"
    fi
    append_manifest_entry "$manifest" "$manifest_entry"
    return 0
}

# Install function
do_install() {
    local target_dir="$PWD"
    local trae_dir="$(get_trae_dir)"

    # Check if ~ was specified (or expanded to $HOME)
    if [ "$#" -ge 1 ]; then
        if [ "$1" = "~" ] || [ "$1" = "$HOME" ]; then
            target_dir="$HOME"
        fi
    fi

    # Check if we're already inside a .trae or .trae-cn directory
    local current_dir_name="${target_dir##*/}"
    local trae_full_path

    if [ "$current_dir_name" = ".trae" ] || [ "$current_dir_name" = ".trae-cn" ]; then
        # Already inside the trae directory, use it directly
        trae_full_path="$target_dir"
    else
        # Normal case: append trae_dir to target_dir
        trae_full_path="$target_dir/$trae_dir"
    fi

    echo "ecc Trae Installer"
    echo "=================="
    echo ""
    echo "Source:  $REPO_ROOT"
    echo "Target:  $trae_full_path/"
    echo ""

    # Subdirectories to create
    SUBDIRS="commands agents skills rules"

    # Create all required trae subdirectories
    for dir in $SUBDIRS; do
        mkdir -p "$trae_full_path/$dir"
    done

    # Manifest file to track installed files
    MANIFEST="$trae_full_path/.ecc-manifest"
    : > "$MANIFEST"

    # Counters for summary
    commands=0
    agents=0
    skills=0
    rules=0
    other=0
    copied_skills_file="$(mktemp)"

    # Copy commands from repo root
    if [ -d "$REPO_ROOT/commands" ]; then
        for f in "$REPO_ROOT/commands"/*.md; do
            [ -f "$f" ] || continue
            local_name="${f##*/}"
            target_path="$trae_full_path/commands/$local_name"
            if copy_managed_file "$f" "$target_path" "$MANIFEST" "commands/$local_name"; then
                commands=$((commands + 1))
            fi
        done
    fi

    # Copy agents from repo root
    if [ -d "$REPO_ROOT/agents" ]; then
        for f in "$REPO_ROOT/agents"/*.md; do
            [ -f "$f" ] || continue
            local_name="${f##*/}"
            target_path="$trae_full_path/agents/$local_name"
            if copy_managed_file "$f" "$target_path" "$MANIFEST" "agents/$local_name"; then
                agents=$((agents + 1))
            fi
        done
    fi

    # Copy skills from repo root (if available)
    if [ -d "$REPO_ROOT/skills" ]; then
        while IFS= read -r source_file; do
            relative_from_skills="${source_file#$REPO_ROOT/skills/}"
            skill_name="${relative_from_skills%%/*}"
            relative_path="${relative_from_skills#*/}"
            target_skill_dir="$trae_full_path/skills/$skill_name"

            target_path="$target_skill_dir/$relative_path"
            mkdir -p "${target_path%/*}"
            if copy_managed_file "$source_file" "$target_path" "$MANIFEST" "skills/$skill_name/$relative_path"; then
                echo "$skill_name" >> "$copied_skills_file"
            fi
        done < <(find "$REPO_ROOT/skills" -type f | sort)

        skills="$(sort -u "$copied_skills_file" | wc -l | tr -d ' ')"
    fi

    # Copy rules from repo root
    if [ -d "$REPO_ROOT/rules" ]; then
        while IFS= read -r rule_file; do
            relative_path="${rule_file#$REPO_ROOT/rules/}"
            target_path="$trae_full_path/rules/$relative_path"

            mkdir -p "${target_path%/*}"
            if copy_managed_file "$rule_file" "$target_path" "$MANIFEST" "rules/$relative_path"; then
                rules=$((rules + 1))
            fi
        done < <(find "$REPO_ROOT/rules" -type f | sort)
    fi

    # Copy README files from this directory
    for readme_file in "$SCRIPT_DIR/README.md" "$SCRIPT_DIR/README.zh-CN.md"; do
        if [ -f "$readme_file" ]; then
            local_name="${readme_file##*/}"
            target_path="$trae_full_path/$local_name"
            if copy_managed_file "$readme_file" "$target_path" "$MANIFEST" "$local_name"; then
                other=$((other + 1))
            fi
        fi
    done

    # Copy install and uninstall scripts
    for script_file in "$SCRIPT_DIR/install.sh" "$SCRIPT_DIR/uninstall.sh"; do
        if [ -f "$script_file" ]; then
            local_name="${script_file##*/}"
            target_path="$trae_full_path/$local_name"
            if copy_managed_file "$script_file" "$target_path" "$MANIFEST" "$local_name" 1; then
                other=$((other + 1))
            fi
        fi
    done

    # Add manifest file itself to manifest
    ensure_manifest_entry "$MANIFEST" ".ecc-manifest"
    sort -u "$MANIFEST" -o "$MANIFEST"
    rm -f "$copied_skills_file"

    # Installation summary
    echo "Installation complete!"
    echo ""
    echo "Components installed:"
    echo "  Commands:  $commands"
    echo "  Agents:    $agents"
    echo "  Skills:    $skills"
    echo "  Rules:     $rules"
    echo ""
    echo "Directory:   ${trae_full_path##*/}"
    echo ""
    echo "Next steps:"
    echo "  1. Open your project in Trae"
    echo "  2. Type / to see available commands"
    echo "  3. Enjoy the ecc workflows!"
    echo ""
    echo "To uninstall later:"
    echo "  cd $trae_full_path"
    echo "  ./uninstall.sh"
}

# Main logic
do_install "$@"
