import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { createSchemaContext } from '../src/schema-validation.js';
import { validateOcrsPackage } from '../src/package-validator.js';
import { applyFixtureMutation, type InvalidFixture } from '../src/fixture-mutations.js';
import { listJsonFiles, loadJsonFile } from '../src/schema-loader.js';
import { readyPackage } from './helpers.js';

describe('schemas and semantic packages', () => {
  it('compiles every schema as Draft 2020-12', () => {
    const context = createSchemaContext();
    expect(context.files.length).toBeGreaterThanOrEqual(40);
    expect(context.files.every((file) => loadJsonFile(file).$schema === 'https://json-schema.org/draft/2020-12/schema')).toBe(true);
  });

  it('validates the complete canonical package', () => {
    expect(validateOcrsPackage(readyPackage())).toEqual([]);
  });

  it('fails every invalid fixture for its controlled expected reason', () => {
    const base = readyPackage();
    const files = listJsonFiles(path.join(process.cwd(), 'conformance', 'invalid')).filter((file) => file.endsWith('.fixture.json'));
    expect(files.length).toBeGreaterThanOrEqual(20);
    for (const file of files) {
      const fixture = loadJsonFile<InvalidFixture>(file);
      const codes = validateOcrsPackage(applyFixtureMutation(base, fixture)).map((item) => item.code);
      expect(codes, path.basename(file)).toContain(fixture.expectedCode);
    }
  });

  it('does not let project aggregation override a conflicting system', () => {
    const pkg = readyPackage();
    pkg.systems[0].readinessStatus = 'not_ready';
    expect(validateOcrsPackage(pkg).map((item) => item.code)).toContain('PROJECT_STATUS_OVERRIDE');
  });
});
