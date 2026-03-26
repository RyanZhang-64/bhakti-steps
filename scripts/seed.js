/**
 * seed.js — Populate DynamoDB tables via AppSync GraphQL
 *
 * Usage:
 *   1. Run `amplify push` first to deploy the backend
 *   2. Run `node scripts/seed.js`
 *
 * Requires: amplifyconfiguration.json to exist (created by `amplify push`)
 */

const { Amplify } = require('aws-amplify');
const { generateClient } = require('aws-amplify/api');

// Load Amplify config — adjust path if needed
let config;
try {
  config = require('../src/amplifyconfiguration.json');
} catch {
  console.error('ERROR: src/amplifyconfiguration.json not found.');
  console.error('Run `amplify push` first to generate the config file.');
  process.exit(1);
}

Amplify.configure(config);
const client = generateClient();

// ─── Mutations ────────────────────────────────────────────

const createReferenceItem = /* GraphQL */ `
  mutation CreateReferenceItem($input: CreateReferenceItemInput!) {
    createReferenceItem(input: $input) { id }
  }
`;

const createBook = /* GraphQL */ `
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) { id }
  }
`;

const createCourse = /* GraphQL */ `
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) { id }
  }
`;

const createScoringConfig = /* GraphQL */ `
  mutation CreateScoringConfig($input: CreateScoringConfigInput!) {
    createScoringConfig(input: $input) { id }
  }
`;

// ─── Reference Data ───────────────────────────────────────

const referenceData = {
  'Service Departments': [
    'Bhakti Steps', 'Broadcast Services', 'Devotee Care Team',
    'Facilities & Maintenance', 'Festivals', 'Finance',
    'Food for Life', "Govinda's Restaurant", 'Guest Care Team',
    "Krishna Club & Children's Events", 'London Community for Vaisnava Marriage',
    'London College of Vedic Studies', 'Nitya Seva', 'Pujari Department',
    "Radha's Boutique", 'Reception', 'Russian-Speaking Community',
    'Sankirtan', 'SEVA Patron Care', 'Studio 108',
    'Sunday Feast', 'VISA', 'Volunteer Care', 'Other',
  ],
  'Course Categories': [
    'Bhakti Shastri', 'Grihastha', 'Youth', 'Counsellor Training', 'Other',
  ],
  'Spiritual Masters': [
    'HH Sivarama Swami', 'HH Radhanath Swami', 'HH Bhakti Charu Swami',
    'HH Kadamba Kanana Swami', 'HG Sutapa Das',
  ],
  'Prabhupada Books': [
    'Bhagavad-gita As It Is',
    'SB Canto 1', 'SB Canto 2', 'SB Canto 3', 'SB Canto 4',
    'SB Canto 5', 'SB Canto 6', 'SB Canto 7', 'SB Canto 8',
    'SB Canto 9', 'SB Canto 10', 'SB Canto 11', 'SB Canto 12',
    'CC Adi-lila', 'CC Madhya-lila Vol.1', 'CC Madhya-lila Vol.2',
    'CC Madhya-lila Vol.3', 'CC Madhya-lila Vol.4', 'CC Madhya-lila Vol.5',
    'CC Madhya-lila Vol.6', 'CC Madhya-lila Vol.7', 'CC Madhya-lila Vol.8',
    'CC Madhya-lila Vol.9', 'CC Antya-lila Vol.1', 'CC Antya-lila Vol.2',
    'CC Antya-lila Vol.3', 'CC Antya-lila Vol.4', 'CC Antya-lila Vol.5',
    'CC Antya-lila Vol.6',
    'Sri Isopanisad', 'Nectar of Devotion', 'Nectar of Instruction',
    'Teachings of Lord Caitanya', 'Krishna Book Vol.1', 'Krishna Book Vol.2',
    'Easy Journey to Other Planets', 'Raja-vidya', 'Elevation to Krishna Consciousness',
    'Krishna Consciousness: The Matchless Gift',
    'Krishna Consciousness: The Topmost Yoga System',
    'Perfect Questions, Perfect Answers',
    'Life Comes From Life', 'Message of Godhead',
    'Civilization and Transcendence', 'The Journey of Self-Discovery',
    'The Path of Perfection', 'Quest for Enlightenment',
    'Renunciation Through Wisdom', 'Beyond Birth and Death',
  ],
  'Courses': [
    'ISKCON Disciples Course (IDC)',
    'Bhakti Shastri Module 1',
    'Bhakti Shastri Module 2',
    'Grihastha Course',
    'Youth Preacher Training',
    'Intro to Devotional Cooking',
    'Temple Worship Standards',
  ],
  'Curriculum Modules': [
    'Japa Meditation',
    'Bhagavatam Study',
    'Vaisnava Etiquette',
    'Festival Calendar',
    'Deity Worship Basics',
    'Kirtan & Music',
  ],
  'Morning Programme': [
    'Mangala Arati',
    'Japa Meditation',
    'Guru Puja',
    'Bhagavatam Class',
    'Tulasi Puja',
    'Evening Kirtana',
  ],
};

// ─── Books (structured catalog) ───────────────────────────

const books = [
  { title: 'Bhagavad-gita As It Is', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core' },
  { title: 'Sri Isopanisad', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core' },
  { title: 'Nectar of Devotion', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core' },
  { title: 'Nectar of Instruction', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core' },
  { title: 'Teachings of Lord Caitanya', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core' },
  { title: 'Easy Journey to Other Planets', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Introductory' },
  { title: 'Raja-vidya', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Introductory' },
  { title: 'Krishna Book Vol.1', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Krishna Lila' },
  { title: 'Krishna Book Vol.2', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Krishna Lila' },
  // Srimad Bhagavatam collection
  ...Array.from({ length: 12 }, (_, i) => ({
    title: `Srimad Bhagavatam Canto ${i + 1}`,
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Srimad Bhagavatam',
    collection: 'Srimad Bhagavatam',
    volumeNumber: i + 1,
  })),
  // Caitanya-caritamrta collection
  { title: 'Caitanya-caritamrta Adi-lila', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Caitanya-caritamrta', collection: 'Caitanya-caritamrta', volumeNumber: 1 },
  ...Array.from({ length: 9 }, (_, i) => ({
    title: `Caitanya-caritamrta Madhya-lila Vol.${i + 1}`,
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Caitanya-caritamrta',
    collection: 'Caitanya-caritamrta',
    volumeNumber: i + 2,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    title: `Caitanya-caritamrta Antya-lila Vol.${i + 1}`,
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Caitanya-caritamrta',
    collection: 'Caitanya-caritamrta',
    volumeNumber: i + 11,
  })),
];

// ─── Courses ──────────────────────────────────────────────

const courses = [
  { name: 'ISKCON Disciples Course (IDC)', category: 'Bhakti Shastri' },
  { name: 'Bhakti Shastri Module 1', category: 'Bhakti Shastri' },
  { name: 'Bhakti Shastri Module 2', category: 'Bhakti Shastri' },
  { name: 'Grihastha Course', category: 'Grihastha' },
  { name: 'Youth Preacher Training', category: 'Youth' },
  { name: 'Intro to Devotional Cooking', category: 'Other' },
  { name: 'Temple Worship Standards', category: 'Other' },
];

// ─── Scoring Config ───────────────────────────────────────

const defaultScoringConfig = {
  roundsWeight: 40,
  morningProgrammeWeight: 30,
  bookReadingWeight: 15,
  moodWeight: 10,
  sevaWeight: 5,
  bookReadingTargetMinutes: 30,
};

// ─── Main ─────────────────────────────────────────────────

async function seed() {
  console.log('Seeding Bhakti Steps database...\n');

  // 1. Reference Items
  let refCount = 0;
  for (const [category, items] of Object.entries(referenceData)) {
    for (let i = 0; i < items.length; i++) {
      try {
        await client.graphql({
          query: createReferenceItem,
          variables: { input: { category, name: items[i], active: true, sortOrder: i } },
        });
        refCount++;
      } catch (err) {
        console.error(`  Failed: ${category} / ${items[i]}:`, err.errors?.[0]?.message || err.message);
      }
    }
    console.log(`  [ReferenceItem] ${category}: ${items.length} items`);
  }
  console.log(`  Total reference items: ${refCount}\n`);

  // 2. Books
  let bookCount = 0;
  for (const book of books) {
    try {
      await client.graphql({ query: createBook, variables: { input: book } });
      bookCount++;
    } catch (err) {
      console.error(`  Failed: ${book.title}:`, err.errors?.[0]?.message || err.message);
    }
  }
  console.log(`  [Book] ${bookCount} books seeded\n`);

  // 3. Courses
  let courseCount = 0;
  for (const course of courses) {
    try {
      await client.graphql({ query: createCourse, variables: { input: { ...course, active: true } } });
      courseCount++;
    } catch (err) {
      console.error(`  Failed: ${course.name}:`, err.errors?.[0]?.message || err.message);
    }
  }
  console.log(`  [Course] ${courseCount} courses seeded\n`);

  // 4. Scoring Config
  try {
    await client.graphql({ query: createScoringConfig, variables: { input: defaultScoringConfig } });
    console.log(`  [ScoringConfig] Default config seeded\n`);
  } catch (err) {
    console.error(`  Failed scoring config:`, err.errors?.[0]?.message || err.message);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
