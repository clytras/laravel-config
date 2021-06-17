const crypto = require('crypto');
const Cryptr = require('../src/crypto/cryptr').default;

const defaultAlgorithm = 'aes-256-gcm';
const defaultEncoding = 'base64';
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const tagPosition = saltLength + ivLength;
const encryptedPosition = tagPosition + tagLength;

// https://github.com/MauriceButler/cryptr
// This is the originbal JS version of the function
// that we will compare with the new TS class version.
function OriginalCryptr(secret, options) {
  const opts = Object.assign(
    {
      algorithm: defaultAlgorithm,
      encoding: defaultEncoding,
    },
    options
  );

  if (
    !(typeof secret === 'string' || secret instanceof Buffer) ||
    secret.length === 0
  ) {
    throw new Error('Cryptr: secret must be a non empty string or Buffer');
  }

  function getKey(salt) {
    return crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha512');
  }

  this.encrypt = function encrypt(value) {
    if (value === undefined || value === null) {
      throw new Error('value must not be null or undefined');
    }

    const iv = crypto.randomBytes(ivLength);
    const salt = crypto.randomBytes(saltLength);

    const key = getKey(salt);

    const cipher = crypto.createCipheriv(opts.algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(String(value), 'utf8'),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    const result = Buffer.concat([salt, iv, tag, encrypted]);

    if (opts.encoding) {
      return result.toString(opts.encoding);
    }

    return result;
  };

  this.decrypt = function decrypt(value) {
    if (value === undefined || value === null) {
      throw new Error('value must not be null or undefined');
    }

    const stringValue = opts.encoding
      ? Buffer.from(String(value), opts.encoding)
      : value;

    const salt = stringValue.slice(0, saltLength);
    const iv = stringValue.slice(saltLength, tagPosition);
    const tag = stringValue.slice(tagPosition, encryptedPosition);
    const encrypted = stringValue.slice(encryptedPosition);

    const key = getKey(salt);

    const decipher = crypto.createDecipheriv(opts.algorithm, key, iv);

    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final('utf8');
  };
}

describe('utils:cryptr', () => {
  const data =
    'This is the text to test encrypt/decrypt (with unicode ßáÇÖÑ 🥓)';
  const secret = 'ThisIsTheSecret';
  let oldCryptr, oldEncryptedData;
  let newCryptr, newEncryptedData;

  it('should encrypt/decrypt (old cryptr)', () => {
    // Test old JS function decryptr
    oldCryptr = new OriginalCryptr(secret);

    oldEncryptedData = oldCryptr.encrypt(data);
    expect(oldEncryptedData).not.toBe(data);

    const oldDecryptedData = oldCryptr.decrypt(oldEncryptedData);
    expect(oldDecryptedData).toBe(data);
  });

  it('should encrypt/decrypt (new cryptr)', () => {
    // Test new TS class decryptr
    newCryptr = new Cryptr(secret);

    newEncryptedData = newCryptr.encrypt(data);
    expect(newEncryptedData).not.toBe(data);

    const newDecryptedData = newCryptr.decrypt(newEncryptedData);
    expect(newDecryptedData).toBe(data);
  });

  it('should decrypt new cryptr data using old cryptr', () => {
    // Test old decryptr to decrypt new decryptr data
    const oldCryptr2 = new OriginalCryptr(secret);

    const oldDecryptedNewData = oldCryptr2.decrypt(newEncryptedData);
    expect(oldDecryptedNewData).toBe(data);
  });

  it('should decrypt old cryptr data using new cryptr', () => {
    // Test new decryptr to decrypt old decryptr data
    const newCryptr2 = new Cryptr(secret);

    const newDecryptedOldData = newCryptr2.decrypt(oldEncryptedData);
    expect(newDecryptedOldData).toBe(data);
  });
});
