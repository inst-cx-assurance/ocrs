export interface InvalidFixture {
  name: string;
  expectedCode: string;
  baseValidFixture?: string;
  mutation?: Mutation;
  mutations?: Mutation[];
}

export interface ValidFixture {
  name: string;
  mutations: Mutation[];
  expectedRecordIds: string[];
}

export interface Mutation {
  op: 'add' | 'replace' | 'remove';
  path: string;
  value?: unknown;
}

export interface ControlledScenario {
  scenarioId: string;
  basePackage: string;
  expectedResult: string;
  mutations: Mutation[];
}

export function applyFixtureMutation<T>(base: T, fixture: InvalidFixture): T {
  const mutations = fixture.mutations ?? (fixture.mutation ? [fixture.mutation] : []);
  return applyMutations(base, mutations);
}

export function applyMutations<T>(base: T, mutations: Mutation[]): T {
  return mutations.reduce(
    (current, mutation) => applyMutation(current, mutation),
    structuredClone(base),
  );
}

function applyMutation<T>(base: T, mutation: Mutation): T {
  const copy = structuredClone(base) as unknown as Record<string, unknown>;
  const tokens = mutation.path
    .split('/')
    .slice(1)
    .map((token) => token.replaceAll('~1', '/').replaceAll('~0', '~'));
  const last = tokens.pop();
  if (last === undefined) throw new Error(`Invalid mutation path ${mutation.path}.`);
  let parent: any = copy;
  for (const token of tokens) parent = parent[Array.isArray(parent) ? Number(token) : token];
  const key: string | number = Array.isArray(parent) ? Number(last) : last;
  if (mutation.op === 'remove') {
    if (Array.isArray(parent)) parent.splice(key as number, 1);
    else delete parent[key];
  } else if (mutation.op === 'add' && Array.isArray(parent))
    parent.splice(key as number, 0, mutation.value);
  else parent[key] = mutation.value;
  return copy as unknown as T;
}
