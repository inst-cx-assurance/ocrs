import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function loadJsonFile<T = Record<string, unknown>>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

export function listJsonFiles(root: string): string[] {
  const output: string[] = [];
  walk(root, output);
  return output.filter((file) => file.endsWith('.json')).sort();
}

function walk(directory: string, output: string[]): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath, output);
    else if (entry.isFile()) output.push(fullPath);
  }
}
