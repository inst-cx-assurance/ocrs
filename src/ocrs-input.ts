import path from 'node:path';
import { loadJsonFile } from './schema-loader.js';
import { applyMutations, type ControlledScenario } from './fixture-mutations.js';
import { type OcrsPackage } from './ocrs-types.js';

export function loadOcrsInput(file: string): OcrsPackage {
  const input = loadJsonFile<OcrsPackage | ControlledScenario>(file);
  if (!('basePackage' in input)) return input;
  if (path.isAbsolute(input.basePackage) || input.basePackage.includes('..')) throw new Error('Scenario basePackage must be a safe relative filename.');
  const basePath = path.resolve(path.dirname(file), input.basePackage);
  if (path.dirname(basePath) !== path.resolve(path.dirname(file))) throw new Error('Scenario basePackage escapes its directory.');
  return applyMutations(loadJsonFile<OcrsPackage>(basePath), input.mutations);
}
