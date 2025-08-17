import { QUERY_HASH } from './constants';

export function createUrlPattern({
  domainPattern,
  urlsPatterns,
}: {
  domainPattern: string;
  urlsPatterns: Record<string, string>;
}) {
  const patterns: Record<string, RegExp> = {};
  for (const [key, value] of Object.entries(urlsPatterns)) {
    patterns[key] = new RegExp(
      `^(?:https?://)?${domainPattern}${value}(?:&.*)?${QUERY_HASH}$`,
      'i',
    );
  }
  return patterns;
}
