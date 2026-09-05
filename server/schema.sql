CREATE DATABASE IF NOT EXISTS myastroreader CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myastroreader;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS astrologers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  tagline VARCHAR(255),
  bio TEXT,
  specializations VARCHAR(500),
  experience_years INT,
  languages VARCHAR(255),
  avatar_initials VARCHAR(5) DEFAULT 'AJ',
  is_online BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  astrologer_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  description VARCHAR(500),
  price_paise INT NOT NULL,
  duration_min INT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (astrologer_id) REFERENCES astrologers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  package_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  birth_date DATE,
  birth_time TIME,
  birth_place VARCHAR(255),
  preferred_datetime DATETIME,
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  razorpay_order_id VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  payment_status ENUM('unpaid','paid','failed') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (package_id) REFERENCES packages(id)
);

CREATE TABLE IF NOT EXISTS chart_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type ENUM('kundli','kundli_matching','numerology') NOT NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190),
  phone VARCHAR(30) NOT NULL,
  dob DATE NOT NULL,
  tob TIME,
  pob VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  partner_details JSON,
  status ENUM('new','reviewed','contacted','closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(150),
  quote TEXT NOT NULL,
  rating INT DEFAULT 5,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS horoscopes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zodiac_sign VARCHAR(20) NOT NULL,
  period ENUM('daily','weekly','monthly') NOT NULL DEFAULT 'daily',
  love_text TEXT,
  career_text TEXT,
  finance_text TEXT,
  health_text TEXT,
  travel_text TEXT,
  remedies_text TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_sign_period (zodiac_sign, period)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt VARCHAR(500),
  content LONGTEXT,
  cover_image_url VARCHAR(500),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(190),
  phone VARCHAR(30),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed: the real (only) consultant on MyAstroReader.
INSERT INTO astrologers (name, slug, tagline, bio, specializations, languages, avatar_initials, is_online)
VALUES (
  'Amit Joshi',
  'amit-joshi',
  'Scientific Astrology based Career & Relationship Counselor',
  'Amit Joshi is described as India''s first Scientific Astrology based Career & Relationship Counselor. He holds a B.E. in Mechanical Engineering (First Class with Distinction) from Shivaji University, and trained in astrology under "Master" Greenstone Lobo. His approach, rooted in Rishi Parashar''s traditions, also incorporates distant cosmic bodies (Pluto, Neptune, Uranus, Chiron) and hypothetical planets not considered in traditional systems. He analyzes birth charts without prescribing remedies or rituals -- birth date, time and place are required for an accurate reading. Outside astrology he has run ventures in PVC manufacturing, pharmaceuticals and interior design, and currently manages pharmaceutical businesses and hospital consultancy alongside his astrology practice.',
  'Scientific Astrology, Career Counseling, Relationship Compatibility, Vedic Chart Analysis',
  'English, Marathi',
  'AJ',
  TRUE
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO packages (astrologer_id, name, slug, description, price_paise, duration_min, sort_order)
VALUES
  (1, 'Clarity Session', 'clarity-session', 'Quick answers. Immediate direction -- for pressing concerns.', 300000, 15, 1),
  (1, 'Life Blueprint Session', 'life-blueprint-session', 'Comprehensive chart analysis covering career, relationships and life patterns.', 750000, 40, 2),
  (1, 'Personal Strategy Session', 'personal-strategy-session', 'Deep strategic consultation for major life decisions.', 1500000, 90, 3),
  (1, 'Matchmaking Session', 'matchmaking-session', 'Relationship compatibility analysis.', 500000, 30, 4),
  (1, 'Couple Counseling Session', 'couple-counseling-session', 'Guidance for relationship conflicts.', 1200000, 30, 5),
  (1, 'Quick Check-in', 'quick-check-in', 'Follow-up session for existing clients.', 150000, 10, 6),
  (1, 'The Decision Room', 'the-decision-room', 'Exclusive in-person comprehensive consultation.', 2500000, 90, 7)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed: real testimonials from myastroreader.com/testimonials (verbatim quotes).
INSERT INTO testimonials (name, location, quote, is_featured, sort_order) VALUES
  ('Gajanan Paranjape', 'Austin, Texas, USA', 'His past and current situation readings were extremely accurate. His passion for astrology was evident during the conversation.', TRUE, 1),
  ('Priyanka Thatte Achrekar', 'Brampton, Ontario, Canada', 'About 98% of his past and present readings were correct and his predictions about future gave me great guidance.', TRUE, 2),
  ('Mrs. Supriya Agashe', 'Mumbai', '99% of his readings of my son were correct and was very much satisfied as Mr. Joshi provided each and every detail accurately.', TRUE, 3),
  ('Dr. Neeraj U. Pathak', 'Pune', 'The points, readings which you have discussed from past and present situations are so precise and accurate... accuracy scale for the readings is almost near to 90%.', FALSE, 4),
  ('Vikas Salgar', 'Pune', 'You have accurately identified the problems through which I''m going before telling anything about it... I can say it was 99.9% accurate.', TRUE, 5),
  ('Capt. Vikas Gokhale', 'Kolhapur', 'Amit''s analysis of my birth chart was detailed, comprehensive, elaborate and almost 95% accurate.', FALSE, 6),
  ('Varad Bhandarkar', 'Nagpur', 'Mr. Amit''s study and advice is pure and genuine which is hard to find these days... all the information presented to me was on point.', FALSE, 7),
  ('Akash Singhai', 'Navi Mumbai', 'His judgements about my personality were 100% accurate and he was absolutely right about the dilemma in my mind.', TRUE, 8),
  ('Anjali Bapat', 'Pune', 'All his readings were 100% accurate. In the conversation of more than an hour he made me count my blessings.', FALSE, 9),
  ('Poonam Joshi', 'Mumbai', 'Starting from my birth time till now he predicted 100% true... He even explained minor problems which caused big trauma in future life.', FALSE, 10)
ON DUPLICATE KEY UPDATE quote = VALUES(quote);

-- Seed: real FAQ content from myastroreader.com/faqs (verbatim).
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Does Amit provide a remedy or change the future?', 'Absolutely not. Amit does not give any remedy or change anything about anyone''s future, but he surely can give you an idea as to what you can expect from your charts.', 1),
  ('If I don''t know my time of birth?', 'The time, date and place of birth are absolutely necessary to be correct for an accurate chart. If you don''t know the time, it is better not to go for the consultation.', 2),
  ('Is there any guarantee of accuracy?', 'The accuracy of readings is based on a chart, and if the date, time or place is not accurately given then the reading will not be accurate. So make sure that the birth information is accurate.', 3),
  ('Can I get a record of the counseling?', 'We shall not provide any records but you can record on your own and take point-wise notes.', 4),
  ('What if I miss my appointment?', 'If the appointment is missed, it shall be rescheduled.', 5)
ON DUPLICATE KEY UPDATE answer = VALUES(answer);

-- Seed: placeholder daily horoscope copy (12 signs). Not sourced from either reference site --
-- clearly a starting point for the admin to replace with real editorial content.
INSERT INTO horoscopes (zodiac_sign, period, love_text, career_text, finance_text, health_text, travel_text, remedies_text) VALUES
  ('Aries', 'daily', 'Placeholder love outlook for Aries -- replace via admin.', 'Placeholder career outlook for Aries -- replace via admin.', 'Placeholder finance outlook for Aries -- replace via admin.', 'Placeholder health outlook for Aries -- replace via admin.', 'Placeholder travel outlook for Aries -- replace via admin.', 'Placeholder notes for Aries -- replace via admin.'),
  ('Taurus', 'daily', 'Placeholder love outlook for Taurus -- replace via admin.', 'Placeholder career outlook for Taurus -- replace via admin.', 'Placeholder finance outlook for Taurus -- replace via admin.', 'Placeholder health outlook for Taurus -- replace via admin.', 'Placeholder travel outlook for Taurus -- replace via admin.', 'Placeholder notes for Taurus -- replace via admin.'),
  ('Gemini', 'daily', 'Placeholder love outlook for Gemini -- replace via admin.', 'Placeholder career outlook for Gemini -- replace via admin.', 'Placeholder finance outlook for Gemini -- replace via admin.', 'Placeholder health outlook for Gemini -- replace via admin.', 'Placeholder travel outlook for Gemini -- replace via admin.', 'Placeholder notes for Gemini -- replace via admin.'),
  ('Cancer', 'daily', 'Placeholder love outlook for Cancer -- replace via admin.', 'Placeholder career outlook for Cancer -- replace via admin.', 'Placeholder finance outlook for Cancer -- replace via admin.', 'Placeholder health outlook for Cancer -- replace via admin.', 'Placeholder travel outlook for Cancer -- replace via admin.', 'Placeholder notes for Cancer -- replace via admin.'),
  ('Leo', 'daily', 'Placeholder love outlook for Leo -- replace via admin.', 'Placeholder career outlook for Leo -- replace via admin.', 'Placeholder finance outlook for Leo -- replace via admin.', 'Placeholder health outlook for Leo -- replace via admin.', 'Placeholder travel outlook for Leo -- replace via admin.', 'Placeholder notes for Leo -- replace via admin.'),
  ('Virgo', 'daily', 'Placeholder love outlook for Virgo -- replace via admin.', 'Placeholder career outlook for Virgo -- replace via admin.', 'Placeholder finance outlook for Virgo -- replace via admin.', 'Placeholder health outlook for Virgo -- replace via admin.', 'Placeholder travel outlook for Virgo -- replace via admin.', 'Placeholder notes for Virgo -- replace via admin.'),
  ('Libra', 'daily', 'Placeholder love outlook for Libra -- replace via admin.', 'Placeholder career outlook for Libra -- replace via admin.', 'Placeholder finance outlook for Libra -- replace via admin.', 'Placeholder health outlook for Libra -- replace via admin.', 'Placeholder travel outlook for Libra -- replace via admin.', 'Placeholder notes for Libra -- replace via admin.'),
  ('Scorpio', 'daily', 'Placeholder love outlook for Scorpio -- replace via admin.', 'Placeholder career outlook for Scorpio -- replace via admin.', 'Placeholder finance outlook for Scorpio -- replace via admin.', 'Placeholder health outlook for Scorpio -- replace via admin.', 'Placeholder travel outlook for Scorpio -- replace via admin.', 'Placeholder notes for Scorpio -- replace via admin.'),
  ('Sagittarius', 'daily', 'Placeholder love outlook for Sagittarius -- replace via admin.', 'Placeholder career outlook for Sagittarius -- replace via admin.', 'Placeholder finance outlook for Sagittarius -- replace via admin.', 'Placeholder health outlook for Sagittarius -- replace via admin.', 'Placeholder travel outlook for Sagittarius -- replace via admin.', 'Placeholder notes for Sagittarius -- replace via admin.'),
  ('Capricorn', 'daily', 'Placeholder love outlook for Capricorn -- replace via admin.', 'Placeholder career outlook for Capricorn -- replace via admin.', 'Placeholder finance outlook for Capricorn -- replace via admin.', 'Placeholder health outlook for Capricorn -- replace via admin.', 'Placeholder travel outlook for Capricorn -- replace via admin.', 'Placeholder notes for Capricorn -- replace via admin.'),
  ('Aquarius', 'daily', 'Placeholder love outlook for Aquarius -- replace via admin.', 'Placeholder career outlook for Aquarius -- replace via admin.', 'Placeholder finance outlook for Aquarius -- replace via admin.', 'Placeholder health outlook for Aquarius -- replace via admin.', 'Placeholder travel outlook for Aquarius -- replace via admin.', 'Placeholder notes for Aquarius -- replace via admin.'),
  ('Pisces', 'daily', 'Placeholder love outlook for Pisces -- replace via admin.', 'Placeholder career outlook for Pisces -- replace via admin.', 'Placeholder finance outlook for Pisces -- replace via admin.', 'Placeholder health outlook for Pisces -- replace via admin.', 'Placeholder travel outlook for Pisces -- replace via admin.', 'Placeholder notes for Pisces -- replace via admin.')
ON DUPLICATE KEY UPDATE love_text = VALUES(love_text);
