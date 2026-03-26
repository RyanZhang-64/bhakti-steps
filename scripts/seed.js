/**
 * seed.js — Populate Supabase database with demo data
 *
 * Usage:
 *   1. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY below
 *   2. Run `node scripts/seed.js`
 *
 * Uses the service_role key (admin access, bypasses RLS).
 * Never use this key in client-side code.
 *
 * NOTE: The auth trigger `handle_new_user()` is expected to auto-create a row
 * in the `users` table when a new auth user is created. Make sure the trigger
 * references columns that actually exist in your `users` table (e.g. it may
 * try to set first_name/last_name from user_metadata — verify those columns
 * exist in the public.users table). If the trigger fails silently, users rows
 * won't be created and downstream inserts (batches, sadhana_entries, etc.)
 * that reference user_id as a foreign key will also fail.
 */

const { createClient } = require('@supabase/supabase-js');

// ─── Configuration ───────────────────────────────────────
// Set these from your Supabase project settings (Settings > API)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

if (SUPABASE_URL.includes('YOUR_PROJECT') || SUPABASE_SERVICE_ROLE_KEY.includes('YOUR_SERVICE')) {
  console.error('ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running.');
  console.error('  export SUPABASE_URL=https://xxx.supabase.co');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Demo Users ──────────────────────────────────────────

const demoUsers = [
  { email: 'admin@bhaktisteps.com', password: 'bhakti123', firstName: 'Admin', lastName: 'User', roles: ['ADMIN'] },
  { email: 'suresh@bhaktisteps.com', password: 'bhakti123', firstName: 'Suresh', lastName: 'Gupta', roles: ['MENTOR'] },
  { email: 'bhakta.john@example.com', password: 'bhakti123', firstName: 'Bhakta', lastName: 'John', roles: ['MENTEE'] },
  { email: 'radha.devi@example.com', password: 'bhakti123', firstName: 'Radha', lastName: 'Devi', roles: ['MENTEE'] },
  { email: 'arjuna@example.com', password: 'bhakti123', firstName: 'Arjuna', lastName: 'Das', roles: ['MENTEE', 'MENTOR'] },
];

// ─── Reference Data ──────────────────────────────────────

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
    'Japa Meditation', 'Bhagavatam Study', 'Vaisnava Etiquette',
    'Festival Calendar', 'Deity Worship Basics', 'Kirtan & Music',
  ],
  'Morning Programme': [
    'Mangala Arati', 'Japa Meditation', 'Guru Puja',
    'Bhagavatam Class', 'Tulasi Puja', 'Evening Kirtana',
  ],
};

// ─── Books (structured catalog) ──────────────────────────
// Table columns: id, title, author, category, total_pages, cover_url, is_active, sort_order, created_at

const books = [
  { title: 'Bhagavad-gita As It Is', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core', is_active: true, sort_order: 1 },
  { title: 'Sri Isopanisad', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core', is_active: true, sort_order: 2 },
  { title: 'Nectar of Devotion', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core', is_active: true, sort_order: 3 },
  { title: 'Nectar of Instruction', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core', is_active: true, sort_order: 4 },
  { title: 'Teachings of Lord Caitanya', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Core', is_active: true, sort_order: 5 },
  { title: 'Easy Journey to Other Planets', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Introductory', is_active: true, sort_order: 6 },
  { title: 'Raja-vidya', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Introductory', is_active: true, sort_order: 7 },
  { title: 'Krishna Book Vol.1', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Krishna Lila', is_active: true, sort_order: 8 },
  { title: 'Krishna Book Vol.2', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Krishna Lila', is_active: true, sort_order: 9 },
  ...Array.from({ length: 12 }, (_, i) => ({
    title: `Srimad Bhagavatam Canto ${i + 1}`,
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Srimad Bhagavatam',
    is_active: true,
    sort_order: 10 + i,
  })),
  { title: 'Caitanya-caritamrta Adi-lila', author: 'A.C. Bhaktivedanta Swami Prabhupada', category: 'Caitanya-caritamrta', is_active: true, sort_order: 22 },
  ...Array.from({ length: 9 }, (_, i) => ({
    title: `Caitanya-caritamrta Madhya-lila Vol.${i + 1}`,
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Caitanya-caritamrta',
    is_active: true,
    sort_order: 23 + i,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    title: `Caitanya-caritamrta Antya-lila Vol.${i + 1}`,
    author: 'A.C. Bhaktivedanta Swami Prabhupada',
    category: 'Caitanya-caritamrta',
    is_active: true,
    sort_order: 32 + i,
  })),
];

// ─── Courses ─────────────────────────────────────────────
// Table columns: id, title, description, level, is_active, sort_order, created_at

const courses = [
  { title: 'ISKCON Disciples Course (IDC)', level: 'Bhakti Shastri', is_active: true, sort_order: 1 },
  { title: 'Bhakti Shastri Module 1', level: 'Bhakti Shastri', is_active: true, sort_order: 2 },
  { title: 'Bhakti Shastri Module 2', level: 'Bhakti Shastri', is_active: true, sort_order: 3 },
  { title: 'Grihastha Course', level: 'Grihastha', is_active: true, sort_order: 4 },
  { title: 'Youth Preacher Training', level: 'Youth', is_active: true, sort_order: 5 },
  { title: 'Intro to Devotional Cooking', level: 'Other', is_active: true, sort_order: 6 },
  { title: 'Temple Worship Standards', level: 'Other', is_active: true, sort_order: 7 },
];

// ─── Scoring Config ──────────────────────────────────────

// scoring_config is a key-value table: { key, value, description }
const defaultScoringConfig = [
  { key: 'rounds_weight', value: 40, description: 'Weight for japa rounds in total score' },
  { key: 'morning_programme_weight', value: 30, description: 'Weight for morning programme attendance' },
  { key: 'book_reading_weight', value: 15, description: 'Weight for book reading minutes' },
  { key: 'hearing_weight', value: 10, description: 'Weight for hearing/lecture minutes' },
  { key: 'seva_weight', value: 5, description: 'Weight for seva hours' },
  { key: 'book_reading_target_minutes', value: 30, description: 'Daily reading target in minutes' },
];

// ─── Main ────────────────────────────────────────────────

async function seed() {
  console.log('Seeding Bhakti Steps Supabase database...\n');

  // 1. Disable the handle_new_user() trigger so createUser doesn't fail.
  //    We'll manually insert users + user_roles rows instead.
  console.log('  Disabling handle_new_user trigger...');
  await supabase.rpc('exec_sql', {
    query: 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;'
  }).then(({ error }) => {
    if (error) console.log('  (Could not drop trigger via RPC — try running manually in SQL Editor:');
    if (error) console.log('    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
    if (error) console.log(`    Error: ${error.message})`);
  });

  // Create auth users, then manually insert into public.users + user_roles
  const userIds = {};
  for (const user of demoUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.roles[0],
        },
      });
      if (error) throw error;
      const userId = data.user.id;
      userIds[user.email] = userId;
      console.log(`  [Auth] Created ${user.email} (${userId})`);

      // Manually insert into public.users (trigger is disabled)
      const { error: userErr } = await supabase.from('users').insert({
        id: userId,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        status: 'ACTIVE',
      });
      if (userErr) throw new Error(`users insert: ${userErr.message}`);

      // Insert all roles
      for (const role of user.roles) {
        const { error: roleErr } = await supabase.from('user_roles').insert({
          user_id: userId,
          role: role,
        });
        if (roleErr) throw new Error(`user_roles insert: ${roleErr.message}`);
      }
      console.log(`  [User] ${user.email} → roles: ${user.roles.join(', ')}`);
    } catch (err) {
      console.error(`  Failed ${user.email}: ${err.message}`);
    }
  }
  console.log();

  // 2. Reference Items
  // Table columns: id, category, label, value, is_active, sort_order, created_at
  let refCount = 0;
  for (const [category, items] of Object.entries(referenceData)) {
    const rows = items.map((label, i) => ({ category, label, value: label, is_active: true, sort_order: i }));
    const { error } = await supabase.from('reference_items').insert(rows);
    if (error) {
      console.error(`  Failed ${category}: ${error.message}`);
    } else {
      refCount += rows.length;
      console.log(`  [ReferenceItem] ${category}: ${rows.length} items`);
    }
  }
  console.log(`  Total reference items: ${refCount}\n`);

  // 3. Books
  const { error: bookErr } = await supabase.from('books').insert(books);
  if (bookErr) console.error(`  Failed books: ${bookErr.message}`);
  else console.log(`  [Book] ${books.length} books seeded\n`);

  // 4. Courses
  const { error: courseErr } = await supabase.from('courses').insert(courses);
  if (courseErr) console.error(`  Failed courses: ${courseErr.message}`);
  else console.log(`  [Course] ${courses.length} courses seeded\n`);

  // 5. Scoring Config (upsert to avoid duplicate key errors on re-run)
  const { error: scoringErr } = await supabase.from('scoring_config').upsert(defaultScoringConfig, { onConflict: 'key' });
  if (scoringErr) console.error(`  Failed scoring config: ${scoringErr.message}`);
  else console.log(`  [ScoringConfig] Default config seeded\n`);

  // 6. Sample batch + members (if mentor and mentees were created)
  // Table columns: id, name, description, mentor_id, start_date, end_date, is_active, created_at, updated_at
  const mentorId = userIds['suresh@bhaktisteps.com'];
  const menteeIds = [
    userIds['bhakta.john@example.com'],
    userIds['radha.devi@example.com'],
  ].filter(Boolean);

  if (mentorId && menteeIds.length > 0) {
    const { data: batch, error: batchErr } = await supabase
      .from('batches')
      .insert({
        name: 'Wednesday Evening Batch',
        description: 'Weekly Wednesday evening session',
        mentor_id: mentorId,
        start_date: new Date().toISOString().split('T')[0],
        is_active: true,
      })
      .select('id')
      .single();

    if (batchErr) {
      console.error(`  Failed batch: ${batchErr.message}`);
    } else {
      const members = menteeIds.map(id => ({ batch_id: batch.id, user_id: id }));
      await supabase.from('batch_members').insert(members);

      console.log(`  [Batch] Created "Wednesday Evening Batch" with ${menteeIds.length} members\n`);
    }

    // 7. Sample sadhana entries for mentees
    // Table columns: id, user_id, date, japa_rounds, japa_score,
    //   mangala_arati, morning_program, tulasi_puja, guru_puja, sb_class,
    //   wake_up_time, sleep_time, reading_minutes, hearing_minutes,
    //   total_score, notes, created_at, updated_at
    const today = new Date();
    for (const menteeId of menteeIds) {
      const entries = [];
      for (let d = 0; d < 14; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        const japaRounds = 12 + Math.floor(Math.random() * 8);
        entries.push({
          user_id: menteeId,
          date: date.toISOString().split('T')[0],
          japa_rounds: japaRounds,
          japa_score: Math.min(japaRounds * 2.5, 25),
          mangala_arati: Math.random() > 0.3,
          morning_program: Math.random() > 0.3,
          tulasi_puja: Math.random() > 0.6,
          guru_puja: Math.random() > 0.4,
          sb_class: Math.random() > 0.5,
          wake_up_time: '04:00',
          sleep_time: '21:30',
          reading_minutes: 15 + Math.floor(Math.random() * 30),
          hearing_minutes: 10 + Math.floor(Math.random() * 20),
          total_score: 55 + Math.floor(Math.random() * 40),
          notes: null,
        });
      }
      const { error } = await supabase.from('sadhana_entries').insert(entries);
      if (error) console.error(`  Failed sadhana for ${menteeId}: ${error.message}`);
    }
    console.log(`  [Sadhana] 14 days of entries for ${menteeIds.length} mentees\n`);

    // 8. Sample mentor notes
    // Table columns: id, mentor_id, mentee_id, content, is_private, created_at
    if (menteeIds[0]) {
      await supabase.from('mentor_notes').insert([
        { mentor_id: mentorId, mentee_id: menteeIds[0], content: 'Doing well with japa, encourage more book reading.', is_private: false },
        { mentor_id: mentorId, mentee_id: menteeIds[0], content: 'Missed last 2 sessions - follow up.', is_private: true },
      ]);
      console.log(`  [MentorNotes] 2 sample notes seeded\n`);
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
