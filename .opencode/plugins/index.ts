/**
 * Everything OpenAI Codex (ecc) Plugins for OpenCode
 *
 * This module exports all ecc plugins for OpenCode integration.
 * Plugins provide hook-based automation that mirrors OpenAI Codex's hook system
 * while taking advantage of OpenCode's more sophisticated 20+ event types.
 */

export { eccHooksPlugin, default } from "./ecc-hooks.js"

// Re-export for named imports
export * from "./ecc-hooks.js"
