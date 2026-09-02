import path from 'node:path';
import { evaluateRfdc } from './rfdc-evaluator.js';
import { loadOcrsInput } from './ocrs-input.js';

const target =
  process.argv[2] ??
  path.join(process.cwd(), 'examples', 'cw-101-reference', 'rfdc-ready.package.json');
console.log(JSON.stringify(evaluateRfdc(loadOcrsInput(target)), null, 2));
