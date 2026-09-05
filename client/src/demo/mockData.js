// Seed content for the standalone demo build (VITE_DEMO_MODE=true).
// Mirrors the real database seed (server/schema.sql) so the demo looks identical
// to the live site. Blog posts here are demo-only illustrative content since the
// real database has none seeded yet.

export const astrologer = {
  id: 1,
  name: 'Amit Joshi',
  slug: 'amit-joshi',
  tagline: 'Scientific Astrology based Career & Relationship Counselor',
  bio: "Amit Joshi is described as India's first Scientific Astrology based Career & Relationship Counselor. He holds a B.E. in Mechanical Engineering (First Class with Distinction) from Shivaji University, and trained in astrology under \"Master\" Greenstone Lobo. His approach, rooted in Rishi Parashar's traditions, also incorporates distant cosmic bodies (Pluto, Neptune, Uranus, Chiron) and hypothetical planets not considered in traditional systems. He analyzes birth charts without prescribing remedies or rituals -- birth date, time and place are required for an accurate reading. Outside astrology he has run ventures in PVC manufacturing, pharmaceuticals and interior design, and currently manages pharmaceutical businesses and hospital consultancy alongside his astrology practice.",
  specializations: 'Scientific Astrology, Career Counseling, Relationship Compatibility, Vedic Chart Analysis',
  experience_years: null,
  languages: 'English, Marathi',
  avatar_initials: 'AJ',
  is_online: 1,
  created_at: '2026-08-12T06:06:44.000Z',
}

export const packages = [
  { id: 1, astrologer_id: 1, name: 'Clarity Session', slug: 'clarity-session', description: 'Quick answers. Immediate direction -- for pressing concerns.', price_paise: 300000, duration_min: 15, sort_order: 1, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
  { id: 2, astrologer_id: 1, name: 'Life Blueprint Session', slug: 'life-blueprint-session', description: 'Comprehensive chart analysis covering career, relationships and life patterns.', price_paise: 750000, duration_min: 40, sort_order: 2, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
  { id: 3, astrologer_id: 1, name: 'Personal Strategy Session', slug: 'personal-strategy-session', description: 'Deep strategic consultation for major life decisions.', price_paise: 1500000, duration_min: 90, sort_order: 3, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
  { id: 4, astrologer_id: 1, name: 'Matchmaking Session', slug: 'matchmaking-session', description: 'Relationship compatibility analysis.', price_paise: 500000, duration_min: 30, sort_order: 4, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
  { id: 5, astrologer_id: 1, name: 'Couple Counseling Session', slug: 'couple-counseling-session', description: 'Guidance for relationship conflicts.', price_paise: 1200000, duration_min: 30, sort_order: 5, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
  { id: 6, astrologer_id: 1, name: 'Quick Check-in', slug: 'quick-check-in', description: 'Follow-up session for existing clients.', price_paise: 150000, duration_min: 10, sort_order: 6, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
  { id: 7, astrologer_id: 1, name: 'The Decision Room', slug: 'the-decision-room', description: 'Exclusive in-person comprehensive consultation.', price_paise: 2500000, duration_min: 90, sort_order: 7, is_active: 1, astrologer_name: 'Amit Joshi', astrologer_slug: 'amit-joshi' },
]

export const testimonials = [
  { id: 1, name: 'Gajanan Paranjape', location: 'Austin, Texas, USA', quote: 'His past and current situation readings were extremely accurate. His passion for astrology was evident during the conversation.', rating: 5, is_featured: 1, sort_order: 1 },
  { id: 2, name: 'Priyanka Thatte Achrekar', location: 'Brampton, Ontario, Canada', quote: 'About 98% of his past and present readings were correct and his predictions about future gave me great guidance.', rating: 5, is_featured: 1, sort_order: 2 },
  { id: 3, name: 'Mrs. Supriya Agashe', location: 'Mumbai', quote: '99% of his readings of my son were correct and was very much satisfied as Mr. Joshi provided each and every detail accurately.', rating: 5, is_featured: 1, sort_order: 3 },
  { id: 4, name: 'Dr. Neeraj U. Pathak', location: 'Pune', quote: 'The points, readings which you have discussed from past and present situations are so precise and accurate... accuracy scale for the readings is almost near to 90%.', rating: 5, is_featured: 0, sort_order: 4 },
  { id: 5, name: 'Vikas Salgar', location: 'Pune', quote: "You have accurately identified the problems through which I'm going before telling anything about it... I can say it was 99.9% accurate.", rating: 5, is_featured: 1, sort_order: 5 },
  { id: 6, name: 'Capt. Vikas Gokhale', location: 'Kolhapur', quote: "Amit's analysis of my birth chart was detailed, comprehensive, elaborate and almost 95% accurate.", rating: 5, is_featured: 0, sort_order: 6 },
  { id: 7, name: 'Varad Bhandarkar', location: 'Nagpur', quote: "Mr. Amit's study and advice is pure and genuine which is hard to find these days... all the information presented to me was on point.", rating: 5, is_featured: 0, sort_order: 7 },
  { id: 8, name: 'Akash Singhai', location: 'Navi Mumbai', quote: 'His judgements about my personality were 100% accurate and he was absolutely right about the dilemma in my mind.', rating: 5, is_featured: 1, sort_order: 8 },
  { id: 9, name: 'Anjali Bapat', location: 'Pune', quote: 'All his readings were 100% accurate. In the conversation of more than an hour he made me count my blessings.', rating: 5, is_featured: 0, sort_order: 9 },
  { id: 10, name: 'Poonam Joshi', location: 'Mumbai', quote: 'Starting from my birth time till now he predicted 100% true... He even explained minor problems which caused big trauma in future life.', rating: 5, is_featured: 0, sort_order: 10 },
]

export const faqs = [
  { id: 1, question: 'Does Amit provide a remedy or change the future?', answer: "Absolutely not. Amit does not give any remedy or change anything about anyone's future, but he surely can give you an idea as to what you can expect from your charts.", sort_order: 1 },
  { id: 2, question: "If I don't know my time of birth?", answer: "The time, date and place of birth are absolutely necessary to be correct for an accurate chart. If you don't know the time, it is better not to go for the consultation.", sort_order: 2 },
  { id: 3, question: 'Is there any guarantee of accuracy?', answer: 'The accuracy of readings is based on a chart, and if the date, time or place is not accurately given then the reading will not be accurate. So make sure that the birth information is accurate.', sort_order: 3 },
  { id: 4, question: 'Can I get a record of the counseling?', answer: 'We shall not provide any records but you can record on your own and take point-wise notes.', sort_order: 4 },
  { id: 5, question: 'What if I miss my appointment?', answer: 'If the appointment is missed, it shall be rescheduled.', sort_order: 5 },
]

const ZODIAC = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

export const horoscopes = ZODIAC.map((sign, i) => ({
  id: i + 1,
  zodiac_sign: sign,
  period: 'daily',
  love_text: `Placeholder love outlook for ${sign} -- replace via admin.`,
  career_text: `Placeholder career outlook for ${sign} -- replace via admin.`,
  finance_text: `Placeholder finance outlook for ${sign} -- replace via admin.`,
  health_text: `Placeholder health outlook for ${sign} -- replace via admin.`,
  travel_text: `Placeholder travel outlook for ${sign} -- replace via admin.`,
  remedies_text: `Placeholder notes for ${sign} -- replace via admin.`,
}))

// Demo-only illustrative posts (the real site has none seeded yet).
export const blogPosts = [
  {
    id: 1,
    title: 'Reading a Birth Chart: Where to Actually Start',
    slug: 'reading-a-birth-chart',
    excerpt: 'Most people jump straight to their sun sign. Here is why the full chart tells a very different story.',
    content:
      'Most people jump straight to their sun sign and stop there. A birth chart is really a snapshot of the sky at the exact moment you were born -- and every placement in it interacts with every other. That is why two people born on the same day can have noticeably different charts once time and place are factored in.\n\nThis is also why accurate birth details matter so much before any consultation: without a correct time and place, the chart itself is unreliable, and so is anything read from it.',
    cover_image_url: '',
    published_at: '2026-07-02T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'What "Scientific Astrology" Means in Practice',
    slug: 'what-scientific-astrology-means',
    excerpt: 'No remedies, no rituals -- just observation, pattern and probability drawn from the chart.',
    content:
      'The approach here is deliberately narrow: analyze the chart, describe patterns, and let the client draw their own conclusions. There are no prescribed remedies, no rituals, and no promises about changing outcomes.\n\nThe value is in clarity -- seeing patterns in your own past and present clearly enough to make better decisions about what comes next.',
    cover_image_url: '',
    published_at: '2026-06-18T09:00:00.000Z',
  },
]

export const enquiriesSeed = []
export const bookingsSeed = []
export const chartRequestsSeed = []
