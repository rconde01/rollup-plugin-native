import { rollup } from 'rollup';
import test from 'ava';

import native from '../src/index.mjs';

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

const testBundle = async (t, bundle) => {
  const { output } = await bundle.generate({ format: 'cjs' });
  const [{ code }] = output;
  const func = new AsyncFunction('t', `let result;\n\n${code}\n\nreturn result;`);

  return func(t);
};

test('imports', async t => {
  t.plan(1);
  t.log(process.cwd());

  const bundle = await rollup({
    input: 'tests/fixtures/imports.mjs',
    plugins: [
        native({
        sync: ['tests/fixtures/imports.node']
      })
    ]
  });
  await testBundle(t, bundle);
});