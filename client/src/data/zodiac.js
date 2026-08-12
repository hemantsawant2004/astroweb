// U+FE0E (VARIATION SELECTOR-15) forces the plain-text glyph instead of the
// colorful emoji presentation some mobile browsers default to for these symbols
// -- without it, zodiac icons render as clashing purple emoji squares.
const TEXT_VS = '︎'

export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈' + TEXT_VS, dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉' + TEXT_VS, dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊' + TEXT_VS, dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋' + TEXT_VS, dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌' + TEXT_VS, dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍' + TEXT_VS, dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎' + TEXT_VS, dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏' + TEXT_VS, dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐' + TEXT_VS, dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑' + TEXT_VS, dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒' + TEXT_VS, dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓' + TEXT_VS, dates: 'Feb 19 - Mar 20' },
]

export function zodiacSymbol(sign) {
  return ZODIAC_SIGNS.find((z) => z.name.toLowerCase() === sign?.toLowerCase())?.symbol || '✦'
}
