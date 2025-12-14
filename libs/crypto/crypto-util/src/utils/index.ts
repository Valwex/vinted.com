const ENCODING_SYMBOL_MAP = { '+': '-', '/': '_' }
const DECODING_SYMBOL_MAP = { '-': '+', _: '/' }

const ENCONDING_SYMBOL_REGEX = new RegExp(
  Object.keys(ENCODING_SYMBOL_MAP)
    .map(symbol => `\\${symbol}`)
    .join('|'),
  'g',
)

const DECODING_SYMBOL_REGEX = new RegExp(
  Object.keys(DECODING_SYMBOL_MAP)
    .map(symbol => `\\${symbol}`)
    .join('|'),
  'g',
)

/**
 * Adapted from https://github.com/ruby/base64/blob/master/lib/base64.rb#L328-L333
 */
export function urlSafeBase64Encode(value: string) {
  return Buffer.from(value, 'binary')
    .toString('base64')
    .replace(ENCONDING_SYMBOL_REGEX, symbol => ENCODING_SYMBOL_MAP[symbol])
}

/**
 * Adapted from https://github.com/ruby/base64/blob/master/lib/base64.rb#L351-L362
 */
export function urlSafeBase64Decode(value: string) {
  return Buffer.from(
    value.replace(DECODING_SYMBOL_REGEX, symbol => DECODING_SYMBOL_MAP[symbol]!),
    'base64',
  ).toString('binary')
}

export async function stringToSha256(value: string) {
  const buffer = new TextEncoder().encode(value)

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
}
