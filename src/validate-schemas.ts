import { createSchemaContext } from './schema-validation.js';

const context = createSchemaContext();
console.log(`Validated ${context.files.length} JSON Schemas against Draft 2020-12 and compiled the package schema.`);
