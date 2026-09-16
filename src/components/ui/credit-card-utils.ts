export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'

export const cardBrandNames: Record<CardBrand, string> = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover', unknown: 'Card' }

export type CreditCardValue = { number: string; expiry: string; cvc: string; name: string }

export const emptyCreditCard: CreditCardValue = { number: '', expiry: '', cvc: '', name: '' }

const digitsOf = (value: string) => value.replace(/\D/g, '')

export function detectCardBrand(number: string): CardBrand {
  const digits = digitsOf(number)
  if (/^4/.test(digits)) return 'visa'
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits)) return 'amex'
  if (/^(6011|65|64[4-9])/.test(digits)) return 'discover'
  return 'unknown'
}

export const cardNumberLength = (brand: CardBrand) => (brand === 'amex' ? 15 : 16)
export const cvcLength = (brand: CardBrand) => (brand === 'amex' ? 4 : 3)

export function formatCardNumber(value: string) {
  const brand = detectCardBrand(value)
  const digits = digitsOf(value).slice(0, cardNumberLength(brand))
  const groups = brand === 'amex' ? [4, 6, 5] : [4, 4, 4, 4]
  const parts: string[] = []
  let offset = 0
  for (const size of groups) {
    if (offset >= digits.length) break
    parts.push(digits.slice(offset, offset + size))
    offset += size
  }
  return parts.join(' ')
}

export function formatExpiry(value: string) {
  let digits = digitsOf(value).slice(0, 4)
  if (/^[2-9]/.test(digits)) digits = `0${digits}`.slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits
}

export function passesLuhn(number: string) {
  const digits = digitsOf(number)
  let sum = 0
  for (let index = 0; index < digits.length; index++) {
    let digit = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return digits.length > 0 && sum % 10 === 0
}

export function validateCreditCard(value: CreditCardValue, { requireName = false }: { requireName?: boolean } = {}) {
  const brand = detectCardBrand(value.number)
  const digits = digitsOf(value.number)
  const [month = '', year = ''] = value.expiry.split('/').map((part) => part.trim())
  const monthNumber = Number(month)
  const now = new Date()
  const expiresAt = new Date(2000 + Number(year), monthNumber, 1)
  const errors: Partial<Record<keyof CreditCardValue, string>> = {}

  if (!digits) errors.number = 'Enter your card number.'
  else if (digits.length < cardNumberLength(brand)) errors.number = 'Your card number is incomplete.'
  else if (!passesLuhn(digits)) errors.number = 'Your card number is invalid.'

  if (!value.expiry) errors.expiry = 'Enter the expiry date.'
  else if (year.length !== 2 || monthNumber < 1 || monthNumber > 12) errors.expiry = 'Use the format MM / YY.'
  else if (expiresAt <= now) errors.expiry = 'This card has expired.'
  else if (expiresAt.getFullYear() > now.getFullYear() + 20) errors.expiry = 'Check the expiry year.'

  if (!value.cvc) errors.cvc = 'Enter the security code.'
  else if (digitsOf(value.cvc).length !== cvcLength(brand)) errors.cvc = `Use ${cvcLength(brand)} digits.`

  if (requireName && !value.name.trim()) errors.name = 'Enter the name on the card.'

  return { brand, errors, valid: Object.keys(errors).length === 0 }
}
