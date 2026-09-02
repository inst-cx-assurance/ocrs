import Ajv2020Import, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import addFormatsImport from 'ajv-formats';
import path from 'node:path';
import { listJsonFiles, loadJsonFile } from './schema-loader.js';

export const PACKAGE_SCHEMA_ID = 'https://spec.ocrs.dev/v0.1/schemas/ocrs-package.schema.json';

export interface SchemaContext {
  ajv: {
    errors?: ErrorObject[] | null;
    validateSchema(schema: unknown): boolean | Promise<unknown>;
    addSchema(schema: unknown): unknown;
    getSchema(id: string): ValidateFunction | undefined;
  };
  packageValidator: ValidateFunction;
  files: string[];
}

export function createSchemaContext(rootDir = process.cwd()): SchemaContext {
  const Ajv2020 = Ajv2020Import as unknown as new (
    options: Record<string, unknown>,
  ) => SchemaContext['ajv'];
  const addFormats = addFormatsImport as unknown as (instance: SchemaContext['ajv']) => unknown;
  const ajv = new Ajv2020({
    allErrors: true,
    strict: true,
    strictTypes: false,
    validateFormats: true,
  });
  addFormats(ajv);
  const files = listJsonFiles(path.join(rootDir, 'schemas'));

  for (const file of files) {
    const schema = loadJsonFile<Record<string, unknown>>(file);
    if (!ajv.validateSchema(schema)) {
      throw new Error(`Invalid Draft 2020-12 schema ${file}: ${formatAjvErrors(ajv.errors)}`);
    }
    ajv.addSchema(schema);
  }

  const packageValidator = ajv.getSchema(PACKAGE_SCHEMA_ID);
  if (!packageValidator) throw new Error(`Package schema ${PACKAGE_SCHEMA_ID} was not registered.`);
  return { ajv, packageValidator, files };
}

export function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  return (errors ?? [])
    .map((error) => `${error.instancePath || '/'} ${error.message ?? error.keyword}`)
    .join('; ');
}
