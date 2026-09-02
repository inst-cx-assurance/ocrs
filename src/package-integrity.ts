import { createHash } from 'node:crypto';

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`)
    .join(',')}}`;
}

export function packageContentHash(packageData: Record<string, unknown>): string {
  const copy = structuredClone(packageData) as { manifest?: { contentHash?: unknown } };
  if (copy.manifest) delete copy.manifest.contentHash;
  return createHash('sha256').update(canonicalize(copy), 'utf8').digest('hex');
}
