const CIPHERTEXT = 'AgKIu37lGApdqrr_v07Lee7VHcGa6S5GA7H_YBOEoL2jzDf23IFo9dl9oDxUVbTzuNR59F_onbvJAn5AizkYu_89dNUhXGHzmSUZ2Uk8ZhAceuwKnInZnSd0xphg'

const PKCS8_PREFIX = new Uint8Array([
  0x30, 0x41, 0x02, 0x01, 0x00, 0x30, 0x13,
  0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
  0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07,
  0x04, 0x27, 0x30, 0x25, 0x02, 0x01, 0x01, 0x04, 0x20,
])

const P = 0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFn
const B = 0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604Bn

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let r = 1n
  base = ((base % mod) + mod) % mod
  while (exp > 0n) {
    if (exp & 1n) {
      r = (r * base) % mod
    }
    exp >>= 1n
    base = (base * base) % mod
  }
  return r
}

function b64urlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    arr[i] = bin.charCodeAt(i)
  }
  return arr
}

function decompressP256(compressed: Uint8Array): Uint8Array {
  let x = 0n
  for (let i = 1; i < 33; i++) {
    x = (x << 8n) | BigInt(compressed[i])
  }
  const ySquared = (modPow(x, 3n, P) - 3n * x + B + P * 3n) % P
  let y = modPow(ySquared, (P + 1n) / 4n, P)
  if (((y & 1n) === 1n) !== ((compressed[0] & 1) === 1)) {
    y = P - y
  }
  const out = new Uint8Array(65)
  out[0] = 0x04
  for (let i = 31, tmp = x; i >= 0; i--, tmp >>= 8n) {
    out[1 + i] = Number(tmp & 0xFFn)
  }
  for (let i = 31, tmp = y; i >= 0; i--, tmp >>= 8n) {
    out[33 + i] = Number(tmp & 0xFFn)
  }
  return out
}

export async function decryptAmapKeys(password: string): Promise<[string, string]> {
  const enc = new TextEncoder()
  const S = crypto.subtle

  const pwKey = await S.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const seed = new Uint8Array(await S.deriveBits(
    { name: 'PBKDF2', salt: enc.encode('amap-ecies'), iterations: 100000, hash: 'SHA-256' },
    pwKey, 256,
  ))

  const pkcs8 = new Uint8Array(PKCS8_PREFIX.length + 32)
  pkcs8.set(PKCS8_PREFIX)
  pkcs8.set(seed, PKCS8_PREFIX.length)
  const privKey = await S.importKey('pkcs8', pkcs8, { name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits'])

  const raw = b64urlToBytes(CIPHERTEXT)
  const ephPubUncompressed = decompressP256(raw.subarray(0, 33))
  const iv = raw.subarray(33, 45)
  const ct = raw.subarray(45, raw.length - 16)
  const tag = raw.subarray(raw.length - 16)

  const ephPub = await S.importKey('raw', ephPubUncompressed, { name: 'ECDH', namedCurve: 'P-256' }, false, [])
  const sharedBits = new Uint8Array(await S.deriveBits({ name: 'ECDH', public: ephPub }, privKey, 256))
  const aesKeyBuf = await S.digest('SHA-256', sharedBits)
  const aesKey = await S.importKey('raw', aesKeyBuf, 'AES-GCM', false, ['decrypt'])

  const ciphertext = new Uint8Array(ct.length + tag.length)
  ciphertext.set(ct)
  ciphertext.set(tag, ct.length)
  const plain = new Uint8Array(await S.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext))

  const hex = (buf: Uint8Array) => [...buf].map(b => b.toString(16).padStart(2, '0')).join('')
  return [hex(plain.subarray(0, 16)), hex(plain.subarray(16, 32))]
}
