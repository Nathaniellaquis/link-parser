import { PlatformModule } from '../core/types'
import { QUERY_HASH } from './constants'

/**
 * Append optional trailing slash, querystring and hash fragment to a RegExp pattern.
 * Keeps original flags. If the pattern already contains QUERY_HASH it is returned unchanged.
 */
export function enhancePattern(pattern: RegExp): RegExp {
  // Skip when already contains QUERY_HASH (heuristic)
  if (pattern.source.includes(QUERY_HASH.replace(/\\/g, ''))) return pattern

  // Remove trailing $ to re-append later
  let source = pattern.source
  if (source.endsWith('$')) {
    source = source.slice(0, -1)
  }

  // Ensure pattern ends with optional slash
  if (!source.endsWith('/?')) {
    source += '\\/?'
  }

  source += `${QUERY_HASH}$`
  return new RegExp(source, pattern.flags)
}

/**
 * Recursively walk a PlatformModule patterns object and patch all RegExp values.
 */
export function patchModulePatterns(module: PlatformModule): void {
  // Profile & handle remain unchanged except profile gets hash
  module.patterns.profile = enhancePattern(module.patterns.profile)
  if (module.patterns.content) {
    for (const key of Object.keys(module.patterns.content)) {
      const p = module.patterns.content[key]
      if (p) {
        (module.patterns.content as Record<string, RegExp | undefined>)[key] = enhancePattern(p)
      }
    }
  }
}

export function patchAllPlatforms(registry: Map<any, PlatformModule>) {
  registry.forEach(patchModulePatterns)
}