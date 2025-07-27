import { sleep } from './sleep';

describe('sleep util', () => {
  test('sleep resolves after given ms', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(100);
  });
});
