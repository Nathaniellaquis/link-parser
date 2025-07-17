import { PlatformModule } from './types';
import { registry } from '../platforms';

/**
 * Attempts to detect the correct platform module for a given URL.
 * Returns undefined if none match.
 */
export function detectPlatform(url: string): PlatformModule | undefined {
  const lower = url.toLowerCase();
  for (const module of registry.values()) {
    if (module.detect(lower)) {
      return module;
    }
  }
  return undefined;
}
