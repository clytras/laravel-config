import { bitCount32 } from '../src/math';

describe('math', () => {
  it('should count bits', async () => {
    let n = 0;
    expect(bitCount32(n)).toStrictEqual(0);

    for (let i = 0; i < 32; i++) {
      n |= 1 << i;
      expect(bitCount32(n)).toStrictEqual(i + 1);
    }

    expect(bitCount32(0xaaaaaaaa)).toStrictEqual(16);
    expect(bitCount32(0x55555555)).toStrictEqual(16);
    expect(bitCount32(-1)).toStrictEqual(32);
  });
});
