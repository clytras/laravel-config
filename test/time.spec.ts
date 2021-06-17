import { sleep, uts, utsj, timeHash } from '../src/time';

describe('time', () => {
  it('should sleep', async () => {
    for (let advance = 5; advance < 50; advance += 5) {
      let start = new Date().getTime();
      // add 5 because there are cases that we get 1 ms lower than the advance time
      await sleep(advance + 5);
      let duration = new Date().getTime() - start;
      expect(duration).toBeGreaterThanOrEqual(advance);
    }
  });

  it('should validate unix time stamp (seconds)', () => {
    const value = uts().toString();
    expect(value).toMatch(/^\d{10}$/);
  });

  it('should validate js unix time stamp (milliseconds)', () => {
    const value = utsj().toString();
    expect(value).toMatch(/^\d{13}$/);
  });

  it('should create valid time hashes', () => {
    const date = new Date();
    for (let base = 2; base <= 36; base++) {
      const expected = date.getTime().toString(base);
      expect(timeHash({ date, base })).toStrictEqual(expected);
    }
  });
});
