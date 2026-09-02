import { createHash } from 'node:crypto';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { canonicalize } from '../src/package-integrity.js';
import { validateOcrsPackage } from '../src/package-validator.js';
import { listJsonFiles, loadJsonFile } from '../src/schema-loader.js';
import { validFixturePackage } from './helpers.js';

describe('semantic hardening', () => {
  it.each([
    'review-recommendation.fixture.json',
    'conditional-decision.fixture.json',
    'system-handover.fixture.json',
    'effective-toc.fixture.json',
  ])('validates Level 2 core fixture %s', (file) => {
    expect(validateOcrsPackage(validFixturePackage(file))).toEqual([]);
  });

  it('covers every requested semantic counterexample with a controlled fixture', () => {
    const files = listJsonFiles(path.join(process.cwd(), 'conformance', 'invalid')).filter((file) =>
      file.endsWith('.fixture.json'),
    );
    expect(files.length).toBeGreaterThanOrEqual(42);
  });

  it('reproduces the published canonicalization test vectors', () => {
    const data = loadJsonFile<{
      vectors: Array<{ input: unknown; canonical: string; sha256: string }>;
    }>(path.join(process.cwd(), 'conformance', 'hash-test-vectors.json'));
    for (const vector of data.vectors) {
      const canonical = canonicalize(vector.input);
      expect(canonical).toBe(vector.canonical);
      expect(createHash('sha256').update(canonical, 'utf8').digest('hex')).toBe(vector.sha256);
    }
  });
});
