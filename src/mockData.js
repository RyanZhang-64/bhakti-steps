/**
 * mockData.js
 * ──────────────────────────────────────────────────────────────
 * Hardcoded demo data ported from the web prototype.
 * Single source of truth for all screen content.
 * ──────────────────────────────────────────────────────────────
 */

export const MockData = {
  /* ── Mock accounts for login ─────────────────────────────── */
  accounts: [
    { id: 'mentee-1',  email: 'john@example.com',       password: 'bhakti123', firstName: 'Bhakta John',  roles: ['mentee'],          defaultRole: 'mentee',  status: 'active' },
    { id: 'mentor-1',  email: 'syama@example.com',      password: 'bhakti123', firstName: 'Syamasundara', roles: ['mentor'],          defaultRole: 'mentor',  status: 'active' },
    { id: 'admin-1',   email: 'govinda@iskcon.london',  password: 'bhakti123', firstName: 'Govinda',      roles: ['admin'],           defaultRole: 'admin',   status: 'active' },
    { id: 'dual-1',    email: 'prabhava@iskcon.london', password: 'bhakti123', firstName: 'Prabhava Das', roles: ['mentor', 'admin'], defaultRole: 'mentor',  status: 'active' },
    { id: 'pending-1', email: 'radha@example.com',      password: 'bhakti123', firstName: 'Radha Devi',   roles: ['mentor'],          defaultRole: 'mentor',  status: 'pending' },
  ],

  /* ── Role-specific user names ──────────────────────────── */
  users: {
    mentee: { firstName: 'Bhakta John', role: 'mentee' },
    mentor: { firstName: 'Syamasundara', role: 'mentor' },
    admin:  { firstName: 'Govinda',     role: 'admin' },
  },

  /* ── Tab configurations per role (§5.1) ────────────────── */
  roleTabs: {
    mentee: [
      { id: 'today',    icon: 'Sun',          label: 'Today' },
      { id: 'progress', icon: 'TrendUp',     label: 'Progress' },
      { id: 'seva',     icon: 'BookOpen',    label: 'Seva & Books' },
      { id: 'profile',  icon: 'User',         label: 'Profile' },
    ],
    mentor: [
      { id: 'sadhana',   icon: 'Sun',          label: 'My Sadhana' },
      { id: 'dashboard', icon: 'SquaresFour', label: 'Dashboard' },
      { id: 'batches',   icon: 'Users',        label: 'Batches' },
      { id: 'approvals', icon: 'CheckCircle', label: 'Approvals' },
      { id: 'profile',   icon: 'User',         label: 'Profile' },
    ],
    admin: [
      { id: 'dashboard', icon: 'ChartBar', label: 'Dashboard' },
      { id: 'users',     icon: 'Users',     label: 'Users' },
      { id: 'batches',   icon: 'Stack',     label: 'Batches' },
      { id: 'settings',  icon: 'Gear',      label: 'Settings' },
    ],
  },

  /* ═══════════════════════════════════════════════════════ */
  /* SADHANA SCORING CONFIG                                   */
  /* ═══════════════════════════════════════════════════════ */

  sadhanaScoring: {
    roundsWeight: 40,
    morningProgrammeWeight: 30,
    bookReadingWeight: 15,
    moodWeight: 10,
    sevaWeight: 5,
    bookReadingTargetMinutes: 30,
    japaTarget: 16,
    moodMultiplierStruggling: 0.25,
    moodMultiplierSteady: 0.5,
    moodMultiplierInspired: 0.75,
    moodMultiplierBlissful: 1.0,
  },

  /* ═══════════════════════════════════════════════════════ */
  /* MENTEE DATA                                             */
  /* ═══════════════════════════════════════════════════════ */

  sadhana: {
    japaTarget: 16,
    japaDefault: 16,

    morningProgramme: [
      { id: 'mangala',    label: 'Mangala Arati',    icon: 'Fire',           defaultOn: false },
      { id: 'japa',       label: 'Japa Meditation',  icon: 'ListBullets',   defaultOn: true },
      { id: 'guru',       label: 'Guru Puja',        icon: 'MusicNotes',    defaultOn: true },
      { id: 'bhagavatam', label: 'Bhagavatam Class',  icon: 'BookOpenText', defaultOn: false },
      { id: 'tulasi',     label: 'Tulasi Puja',      icon: 'Leaf',           defaultOn: false },
      { id: 'kirtana',    label: 'Evening Kirtana',  icon: 'Waveform',       defaultOn: false },
    ],

    moods: ['Struggling', 'Steady', 'Inspired', 'Blissful'],
    defaultMood: 'Steady',
  },

  progressStats: {
    streak: 12,
    avgScore: 84,
    sevaHours: 6.5,
  },

  submissionHistory: [
    { date: 'Tue 25 Feb', score: 84, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Mon 24 Feb', score: 78, mood: 'steady',     mp: [true, true, true, false, false, false] },
    { date: 'Sun 23 Feb', score: 91, mood: 'inspired',   mp: [true, true, true, true, false, true] },
    { date: 'Sat 22 Feb', score: 72, mood: 'struggling', mp: [false, true, false, false, false, false] },
    { date: 'Fri 21 Feb', score: 88, mood: 'blissful',   mp: [true, true, true, true, false, false] },
    { date: 'Thu 20 Feb', score: 80, mood: 'steady',     mp: [false, true, true, false, true, false] },
    { date: 'Wed 19 Feb', score: 85, mood: 'inspired',   mp: [true, true, true, false, false, true] },
    { date: 'Tue 18 Feb', score: 76, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Mon 17 Feb', score: 90, mood: 'blissful',   mp: [true, true, true, true, true, false] },
    { date: 'Sun 16 Feb', score: 68, mood: 'struggling', mp: [false, true, false, false, false, false] },
    { date: 'Sat 15 Feb', score: 82, mood: 'steady',     mp: [true, true, true, false, false, false] },
    { date: 'Fri 14 Feb', score: 95, mood: 'blissful',   mp: [true, true, true, true, true, true] },
    { date: 'Thu 13 Feb', score: 74, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Wed 12 Feb', score: 87, mood: 'inspired',   mp: [true, true, true, true, false, false] },
    { date: 'Tue 11 Feb', score: 79, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Mon 10 Feb', score: 83, mood: 'inspired',   mp: [true, true, true, false, true, false] },
    { date: 'Sun 9 Feb',  score: 92, mood: 'blissful',   mp: [true, true, true, true, true, false] },
    { date: 'Sat 8 Feb',  score: 70, mood: 'struggling', mp: [false, true, false, false, false, false] },
    { date: 'Fri 7 Feb',  score: 86, mood: 'inspired',   mp: [true, true, true, false, false, true] },
    { date: 'Thu 6 Feb',  score: 77, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Wed 5 Feb',  score: 89, mood: 'blissful',   mp: [true, true, true, true, false, false] },
    { date: 'Tue 4 Feb',  score: 73, mood: 'steady',     mp: [false, true, false, false, false, false] },
    { date: 'Mon 3 Feb',  score: 81, mood: 'steady',     mp: [true, true, true, false, false, false] },
    { date: 'Sun 2 Feb',  score: 94, mood: 'blissful',   mp: [true, true, true, true, true, true] },
    { date: 'Sat 1 Feb',  score: 69, mood: 'struggling', mp: [false, false, true, false, false, false] },
    { date: 'Fri 31 Jan', score: 85, mood: 'inspired',   mp: [true, true, true, false, false, true] },
    { date: 'Thu 30 Jan', score: 78, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Wed 29 Jan', score: 88, mood: 'inspired',   mp: [true, true, true, true, false, false] },
    { date: 'Tue 28 Jan', score: 71, mood: 'struggling', mp: [false, true, false, false, false, false] },
    { date: 'Mon 27 Jan', score: 82, mood: 'steady',     mp: [true, true, true, false, false, false] },
    { date: 'Sun 26 Jan', score: 90, mood: 'blissful',   mp: [true, true, true, true, true, false] },
    { date: 'Sat 25 Jan', score: 75, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Fri 24 Jan', score: 84, mood: 'inspired',   mp: [true, true, true, false, false, true] },
    { date: 'Thu 23 Jan', score: 67, mood: 'struggling', mp: [false, false, true, false, false, false] },
    { date: 'Wed 22 Jan', score: 91, mood: 'blissful',   mp: [true, true, true, true, true, false] },
    { date: 'Tue 21 Jan', score: 76, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Mon 20 Jan', score: 80, mood: 'steady',     mp: [true, true, true, false, false, false] },
    { date: 'Sun 19 Jan', score: 93, mood: 'blissful',   mp: [true, true, true, true, true, true] },
    { date: 'Sat 18 Jan', score: 72, mood: 'struggling', mp: [false, true, false, false, false, false] },
    { date: 'Fri 17 Jan', score: 86, mood: 'inspired',   mp: [true, true, true, true, false, false] },
    { date: 'Thu 16 Jan', score: 79, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Wed 15 Jan', score: 87, mood: 'inspired',   mp: [true, true, true, false, true, false] },
    { date: 'Tue 14 Jan', score: 74, mood: 'steady',     mp: [false, true, true, false, false, false] },
    { date: 'Mon 13 Jan', score: 83, mood: 'inspired',   mp: [true, true, true, false, false, true] },
  ],

  departments: [
    'Bhakti Steps',
    'Broadcast Services',
    'Devotee Care Team',
    'Facilities & Maintenance',
    'Festivals',
    'Finance',
    'Food for Life',
    "Govinda's Restaurant",
    'Guest Care Team',
    "Krishna Club & Children's Events",
    'London Community for Vaisnava Marriage',
    'London College of Vedic Studies',
    'Nitya Seva',
    'Pujari Department',
    "Radha's Boutique",
    'Reception',
    'Russian-Speaking Community',
    'Sankirtan',
    'SEVA Patron Care',
    'Studio 108',
    'Sunday Feast',
    'VISA',
    'Volunteer Care',
    'Other',
  ],

  sevaLogs: [
    { date: 'Sat 22 Feb', department: 'Guest Care Team', hours: 2.5, description: 'Welcomed guests at the reception desk and helped with parking.' },
    { date: 'Sun 16 Feb', department: 'Sunday Feast',    hours: 3.0, description: 'Prepared Sunday feast lunch for 120 guests.' },
  ],

  books: [
    { title: 'Bhagavad-gita As It Is',                        owned: true,  status: 'reading' },
    { title: 'Sri Isopanishad',                                owned: true,  status: 'completed' },
    { title: 'Nectar of Devotion',                             owned: false, status: 'not-started' },
    { title: 'Nectar of Instruction',                          owned: true,  status: 'reading' },
    { title: 'Teachings of Lord Caitanya',                     owned: false, status: 'not-started' },
    { title: 'Teachings of Lord Kapila',                       owned: false, status: 'not-started' },
    { title: 'Teachings of Queen Kunti',                       owned: false, status: 'not-started' },
    { title: 'Krsna, the Supreme Personality of Godhead',      owned: true,  status: 'not-started' },
    { title: 'Easy Journey to Other Planets',                  owned: false, status: 'not-started' },
    { title: 'Beyond Birth and Death',                         owned: true,  status: 'completed' },
    { title: 'On the Way to Krsna',                            owned: false, status: 'not-started' },
    { title: 'Raja-Vidya: The King of Knowledge',              owned: false, status: 'not-started' },
    { title: 'Elevation to Krsna Consciousness',               owned: false, status: 'not-started' },
    { title: 'Krsna Consciousness: The Matchless Gift',        owned: false, status: 'not-started' },
    { title: 'The Science of Self-Realization',                owned: true,  status: 'reading' },
    { title: 'Perfect Questions, Perfect Answers',             owned: false, status: 'not-started' },
    { title: 'Journey of Self-Discovery',                      owned: false, status: 'not-started' },
    { title: 'Narada Bhakti Sutra',                            owned: false, status: 'not-started' },
    { title: 'Mukunda-mala-stotra',                            owned: false, status: 'not-started' },
    { title: 'Sri Caitanya Mahaprabhu: His Life and Precepts', owned: false, status: 'not-started' },
  ],

  bookCollections: [
    {
      name: 'Srimad Bhagavatam',
      volumes: [
        { title: 'SB Canto 1.1',  owned: false, status: 'not-started' },
        { title: 'SB Canto 1.2',  owned: false, status: 'not-started' },
        { title: 'SB Canto 2',    owned: false, status: 'not-started' },
        { title: 'SB Canto 3.1',  owned: false, status: 'not-started' },
        { title: 'SB Canto 3.2',  owned: false, status: 'not-started' },
        { title: 'SB Canto 3.3',  owned: false, status: 'not-started' },
        { title: 'SB Canto 4.1',  owned: false, status: 'not-started' },
        { title: 'SB Canto 4.2',  owned: false, status: 'not-started' },
        { title: 'SB Canto 5',    owned: false, status: 'not-started' },
        { title: 'SB Canto 6',    owned: false, status: 'not-started' },
        { title: 'SB Canto 7',    owned: false, status: 'not-started' },
        { title: 'SB Canto 8',    owned: false, status: 'not-started' },
        { title: 'SB Canto 9',    owned: false, status: 'not-started' },
        { title: 'SB Canto 10.1', owned: false, status: 'not-started' },
        { title: 'SB Canto 10.2', owned: false, status: 'not-started' },
        { title: 'SB Canto 10.3', owned: false, status: 'not-started' },
        { title: 'SB Canto 11',   owned: false, status: 'not-started' },
        { title: 'SB Canto 12',   owned: false, status: 'not-started' },
      ],
    },
    {
      name: 'Caitanya-caritamrta',
      volumes: [
        { title: 'CC Adi-lila Vol. 1',    owned: false, status: 'not-started' },
        { title: 'CC Adi-lila Vol. 2',    owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 1', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 2', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 3', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 4', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 5', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 6', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 7', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 8', owned: false, status: 'not-started' },
        { title: 'CC Madhya-lila Vol. 9', owned: false, status: 'not-started' },
        { title: 'CC Antya-lila Vol. 1',  owned: false, status: 'not-started' },
        { title: 'CC Antya-lila Vol. 2',  owned: false, status: 'not-started' },
        { title: 'CC Antya-lila Vol. 3',  owned: false, status: 'not-started' },
        { title: 'CC Antya-lila Vol. 4',  owned: false, status: 'not-started' },
        { title: 'CC Antya-lila Vol. 5',  owned: false, status: 'not-started' },
      ],
    },
  ],

  courses: [
    { name: 'ISKCON Disciples Course', submitted: '15 Jan 2025', status: 'approved' },
    { name: 'Bhakti Shastri Module 1', submitted: '20 Feb 2025', status: 'pending' },
  ],

  menteeProfile: {
    name: 'Bhakta John',
    email: 'john@example.com',
    phone: '+44 7700 900123',
    dateJoined: '12 September 2024',
    dob: '15 March 1995',
    address: '42 Baker Street, London NW1 6XE',
    dateInitiated: null,
    initiatedName: null,
    initiationYear: null,
    spiritualMaster: null,
    japaTarget: 16,
    mentor: { name: 'Syamasundara Das', phone: '+44 7700 900789', email: 'syama@example.com' },
  },

  /* ═══════════════════════════════════════════════════════ */
  /* MENTOR DATA                                             */
  /* ═══════════════════════════════════════════════════════ */

  mentorSadhana: {
    japaTarget: 16,
    japaDefault: 16,
    progressStats: { streak: 45, avgScore: 91, sevaHours: 12 },
    submissionHistory: [
      { date: 'Tue 25 Feb', score: 92, mood: 'blissful',  mp: [true, true, true, true, true, true] },
      { date: 'Mon 24 Feb', score: 88, mood: 'inspired',  mp: [true, true, true, true, false, true] },
      { date: 'Sun 23 Feb', score: 95, mood: 'blissful',  mp: [true, true, true, true, true, true] },
      { date: 'Sat 22 Feb', score: 90, mood: 'inspired',  mp: [true, true, true, false, true, true] },
      { date: 'Fri 21 Feb', score: 85, mood: 'steady',    mp: [true, true, true, true, false, false] },
      { date: 'Thu 20 Feb', score: 91, mood: 'inspired',  mp: [true, true, true, true, true, false] },
      { date: 'Wed 19 Feb', score: 87, mood: 'steady',    mp: [true, true, true, false, true, true] },
      { date: 'Tue 18 Feb', score: 93, mood: 'blissful',  mp: [true, true, true, true, true, true] },
      { date: 'Mon 17 Feb', score: 89, mood: 'inspired',  mp: [true, true, true, true, false, true] },
      { date: 'Sun 16 Feb', score: 94, mood: 'blissful',  mp: [true, true, true, true, true, true] },
      { date: 'Sat 15 Feb', score: 86, mood: 'steady',    mp: [true, true, true, false, false, true] },
      { date: 'Fri 14 Feb', score: 90, mood: 'inspired',  mp: [true, true, true, true, true, false] },
      { date: 'Thu 13 Feb', score: 88, mood: 'steady',    mp: [true, true, true, true, false, true] },
      { date: 'Wed 12 Feb', score: 91, mood: 'inspired',  mp: [true, true, true, true, true, false] },
    ],
    sevaLogs: [
      { date: 'Sat 22 Feb', department: 'Sankirtan', hours: 3, description: 'Saturday morning sankirtan in Soho.' },
      { date: 'Sun 16 Feb', department: 'Sunday Feast', hours: 4, description: 'Coordinated Sunday feast cooking and serving.' },
    ],
    courses: [
      { name: 'Bhakti Shastri Module 2', submitted: '10 Jan 2025', status: 'approved' },
    ],
  },

  mentorDashboard: {
    totalMentees: 12,
    submittedToday: 8,
    pendingActions: 2,
    birthdays: [
      { name: 'Ananda', date: 'tomorrow' },
    ],
    needsAttention: [
      { name: 'David',  initials: 'D', color: '#E8A88B', reason: '4 days since last submission' },
      { name: 'Priya',  initials: 'P', color: '#C8A8D8', reason: 'Score declining' },
    ],
  },

  batches: [
    {
      name: 'Bhakti Steps Yr 1',
      schedule: 'Thursdays, 18:30',
      location: 'Temple Room',
      status: 'active',
      mentees: [
        { name: 'David',  initials: 'D', color: '#E8A88B', ring: 'error' },
        { name: 'Ananda', initials: 'A', color: '#A8C8AD', ring: 'success' },
        { name: 'Jaya',   initials: 'J', color: '#E4CA88', ring: 'warning' },
      ],
      attendance: [
        { date: '20/02', title: 'Japa Workshop Pt 3',   data: { David: 'absent',  Ananda: 'present', Jaya: 'late' } },
        { date: '13/02', title: 'Japa Workshop Pt 2',   data: { David: 'present', Ananda: 'present', Jaya: 'present' } },
        { date: '06/02', title: 'Japa Workshop Pt 1',   data: { David: 'late',    Ananda: 'present', Jaya: 'present' } },
        { date: '30/01', title: 'Intro to Bhakti Pt 4', data: { David: 'present', Ananda: 'late',    Jaya: 'present' } },
        { date: '23/01', title: 'Intro to Bhakti Pt 3', data: { David: 'present', Ananda: 'present', Jaya: 'late' } },
        { date: '16/01', title: 'Intro to Bhakti Pt 2', data: { David: 'late',    Ananda: 'present', Jaya: 'present' } },
        { date: '09/01', title: 'Intro to Bhakti Pt 1', data: { David: 'present', Ananda: 'present', Jaya: 'present' } },
        { date: '02/01', title: 'Welcome Session',      data: { David: 'present', Ananda: 'present', Jaya: 'present' } },
      ],
      sessions: [
        {
          date: '20/02', title: 'Japa Workshop Pt 3', module: 'Japa Workshop',
          description: 'Final session on japa meditation techniques. Covered advanced counting methods, dealing with the wandering mind, and establishing a consistent daily practice. Students shared their experiences from the past two weeks.',
          attendees: { David: 'absent', Ananda: 'present', Jaya: 'late' },
        },
        {
          date: '13/02', title: 'Japa Workshop Pt 2', module: 'Japa Workshop',
          description: 'Continued discussion on japa meditation. Focused on proper pronunciation of the maha-mantra and the importance of attentive chanting. Practical exercises with group chanting.',
          attendees: { David: 'present', Ananda: 'present', Jaya: 'present' },
        },
        {
          date: '06/02', title: 'Japa Workshop Pt 1', module: 'Japa Workshop',
          description: 'Introduction to japa meditation and the significance of the Hare Krishna maha-mantra. Distributed japa beads to new members.',
          attendees: { David: 'late', Ananda: 'present', Jaya: 'present' },
        },
        {
          date: '30/01', title: 'Intro to Bhakti Pt 4', module: 'Introduction to Bhakti',
          description: 'Concluding session on introduction to bhakti yoga. Review of key concepts and Q&A session.',
          attendees: { David: 'present', Ananda: 'late', Jaya: 'present' },
        },
        {
          date: '23/01', title: 'Intro to Bhakti Pt 3', module: 'Introduction to Bhakti',
          description: 'Discussion on the nine processes of devotional service with emphasis on sravanam and kirtanam.',
          attendees: { David: 'present', Ananda: 'present', Jaya: 'late' },
        },
        {
          date: '16/01', title: 'Intro to Bhakti Pt 2', module: 'Introduction to Bhakti',
          description: 'Exploring the philosophy of Bhagavad-gita and its relevance to daily life. Group reading of Chapter 2.',
          attendees: { David: 'late', Ananda: 'present', Jaya: 'present' },
        },
        {
          date: '09/01', title: 'Intro to Bhakti Pt 1', module: 'Introduction to Bhakti',
          description: 'Welcome and introduction to the Bhakti Steps programme. Overview of bhakti yoga and the Hare Krishna tradition.',
          attendees: { David: 'present', Ananda: 'present', Jaya: 'present' },
        },
        {
          date: '02/01', title: 'Welcome Session', module: 'Introduction to Bhakti',
          description: 'Inaugural group session. Icebreaker activities, tour of the temple, and overview of the programme schedule.',
          attendees: { David: 'present', Ananda: 'present', Jaya: 'present' },
        },
      ],
      history: [
        { date: '20 Feb 2025', type: 'session',         text: 'Session "Japa Workshop Pt 3" was run' },
        { date: '18 Feb 2025', type: 'module_start',    text: 'Module "Japa Workshop" started' },
        { date: '15 Feb 2025', type: 'member_left',     text: 'Priya left the group' },
        { date: '13 Feb 2025', type: 'session',         text: 'Session "Japa Workshop Pt 2" was run' },
        { date: '10 Feb 2025', type: 'module_complete', text: 'Module "Introduction to Bhakti" completed' },
        { date: '06 Feb 2025', type: 'session',         text: 'Session "Japa Workshop Pt 1" was run' },
        { date: '01 Feb 2025', type: 'allocation',      text: 'Batch allocation was edited' },
        { date: '15 Jan 2025', type: 'member_join',     text: 'Jaya joined the group' },
        { date: '10 Jan 2025', type: 'member_join',     text: 'David and Ananda joined the group' },
      ],
      modules: [
        { title: 'Introduction to Bhakti', status: 'completed' },
        { title: 'Japa Workshop',          status: 'active' },
        { title: 'Deity Worship Basics',   status: 'upcoming' },
      ],
    },
  ],

  menteeDetail: {
    name: 'David Smith',
    initials: 'D',
    color: '#E8A88B',
    initiatedName: null,
    batch: 'Bhakti Steps Yr 1',
    phone: '+44 7700 900456',
    email: 'david@example.com',
    dob: '22 July 1998',
    address: '10 Soho Square, London W1D 3QD',
    streak: 0,
    notes: [
      { date: '20 Feb, 19:45', text: 'David mentioned he is struggling to wake up for morning programme.' },
      { date: '13 Feb, 20:10', text: 'Good session today. David asked insightful questions about japa concentration.' },
    ],
  },

  mentorProfile: {
    name: 'Syamasundara Das',
    email: 'syama@example.com',
    phone: '+44 7700 900789',
    dateJoined: '5 June 2023',
    isInitiated: true,
    initiatedName: 'Syamasundara Das',
    initiationYear: 2018,
    spiritualMaster: 'HH Sivarama Swami',
    dob: '10 January 1990',
    address: '15 Bury Place, London WC1A 2JB',
    japaTarget: 16,
  },

  mentorNotifications: [
    {
      menteeName: 'David Smith',
      date: 'Tue 25 Feb',
      note: 'Struggled with early morning japa today, only managed 8 rounds before work. Feeling discouraged but will try again tomorrow.',
      score: 64,
      mood: 'struggling',
    },
  ],

  menteeDetailAttendance: [
    { date: 'Thu 20 Feb', status: 'absent',  session: 'Japa Workshop Pt 3' },
    { date: 'Thu 13 Feb', status: 'present', session: 'Japa Workshop Pt 2' },
    { date: 'Thu 6 Feb',  status: 'late',    session: 'Japa Workshop Pt 1' },
    { date: 'Thu 30 Jan', status: 'present', session: 'Intro to Bhakti Pt 4' },
  ],

  pendingApprovals: [
    { menteeName: 'David Smith',  courseName: 'ISKCON Disciples Course', submitted: '18 Feb 2025' },
    { menteeName: 'Ananda Patel', courseName: 'Bhakti Shastri Module 1', submitted: '22 Feb 2025' },
  ],

  /* ═══════════════════════════════════════════════════════ */
  /* ADMIN DATA                                              */
  /* ═══════════════════════════════════════════════════════ */

  adminKPIs: [
    { label: 'Active Users',       value: '142', trend: 'up' },
    { label: 'Submission Rate',    value: '78%', trend: 'up' },
    { label: 'Avg Score',          value: '84',  trend: 'flat' },
    { label: 'Seva Hours',         value: '320', subtitle: 'This month' },
    { label: 'Course Completions', value: '15',  pending: 3 },
    { label: 'Batch Health',       value: '92%', trend: 'up' },
  ],

  adminUsers: [
    { name: 'Syamasundara',  email: 'syama@example.com',       roles: ['mentor'],          lastActive: '2h ago' },
    { name: 'David Smith',   email: 'david@example.com',       roles: ['mentee'],          lastActive: '4d ago' },
    { name: 'Ananda Patel',  email: 'ananda@example.com',      roles: ['mentee'],          lastActive: '1h ago' },
    { name: 'Govinda Das',   email: 'admin@iskcon.london',     roles: ['admin'],           lastActive: 'Now' },
    { name: 'Priya Sharma',  email: 'priya@example.com',       roles: ['mentee'],          lastActive: '3d ago' },
    { name: 'Prabhava Das',  email: 'prabhava@iskcon.london',  roles: ['mentor', 'admin'], lastActive: '1h ago' },
    { name: 'Radha Devi',    email: 'radha@example.com',       roles: ['mentor'],          lastActive: 'Pending', status: 'pending' },
    { name: 'Bhakta James',  email: 'james@example.com',       roles: ['mentee'],          lastActive: '5h ago' },
    { name: 'Tulasi Devi',   email: 'tulasi@example.com',      roles: ['mentee'],          lastActive: '2d ago' },
    { name: 'Madhava Das',   email: 'madhava@example.com',     roles: ['mentor'],          lastActive: '1d ago' },
    { name: 'Rukmini Devi',  email: 'rukmini@example.com',     roles: ['mentee'],          lastActive: '3h ago' },
    { name: 'Gaura Das',     email: 'gaura@example.com',       roles: ['mentee'],          lastActive: '6h ago' },
    { name: 'Nitai Prabhu',  email: 'nitai@example.com',       roles: ['mentor'],          lastActive: '1h ago' },
    { name: 'Sacinandana',   email: 'saci@example.com',        roles: ['mentee'],          lastActive: '4h ago' },
    { name: 'Vrinda Devi',   email: 'vrinda@example.com',      roles: ['mentee'],          lastActive: '2h ago' },
    { name: 'Damodara Das',  email: 'damodara@example.com',    roles: ['mentee'],          lastActive: '1d ago' },
    { name: 'Lalita Devi',   email: 'lalita@example.com',      roles: ['mentee'],          lastActive: '3d ago' },
    { name: 'Hari Das',      email: 'hari@example.com',        roles: ['mentee'],          lastActive: '5d ago' },
    { name: 'Sita Devi',     email: 'sita@example.com',        roles: ['mentee'],          lastActive: '2d ago' },
    { name: 'Rama Das',      email: 'rama@example.com',        roles: ['mentor'],          lastActive: '4h ago' },
    { name: 'Gandhari Devi', email: 'gandhari@example.com',    roles: ['mentee'],          lastActive: '1d ago' },
    { name: 'Arjuna Das',    email: 'arjuna@example.com',      roles: ['mentee'],          lastActive: '6d ago' },
    { name: 'Draupadi Devi', email: 'draupadi@example.com',    roles: ['mentee'],          lastActive: '3h ago' },
    { name: 'Bhima Das',     email: 'bhima@example.com',       roles: ['mentee'],          lastActive: '8h ago' },
    { name: 'Kunti Devi',    email: 'kunti@example.com',       roles: ['mentee'],          lastActive: '2d ago' },
    { name: 'Nakula Das',    email: 'nakula@example.com',      roles: ['mentee'],          lastActive: '5h ago' },
    { name: 'Sahadeva Das',  email: 'sahadeva@example.com',    roles: ['mentee'],          lastActive: '1d ago' },
    { name: 'Subhadra Devi', email: 'subhadra@example.com',    roles: ['mentee'],          lastActive: '4d ago' },
    { name: 'Balarama Das',  email: 'balarama@example.com',    roles: ['mentor'],          lastActive: '2h ago' },
    { name: 'Yashoda Devi',  email: 'yashoda@example.com',     roles: ['mentee'],          lastActive: '7h ago' },
    { name: 'Nanda Das',     email: 'nanda@example.com',       roles: ['mentee'],          lastActive: '3d ago' },
    { name: 'Devaki Devi',   email: 'devaki@example.com',      roles: ['mentee'],          lastActive: '1h ago' },
    { name: 'Vasudeva Das',  email: 'vasudeva@example.com',    roles: ['mentee'],          lastActive: '5d ago' },
    { name: 'Rohini Devi',   email: 'rohini@example.com',      roles: ['mentee'],          lastActive: '2d ago' },
    { name: 'Uddhava Das',   email: 'uddhava@example.com',     roles: ['mentee'],          lastActive: '9h ago' },
  ],

  pendingMentorApplications: [
    { name: 'Radha Devi',       email: 'radha@example.com',       appliedDate: '28 Feb', reason: 'Leading youth programme for 2 years' },
    { name: 'Krishna Chandra',  email: 'krishna.c@example.com',   appliedDate: '25 Feb', reason: 'Bhakti Shastri graduate, counselling experience' },
  ],

  adminBatches: [
    { name: 'Bhakti Steps Yr 2', mentor: 'Syamasundara', status: 'pending',  expected: 8 },
    { name: 'Bhakti Steps Yr 1', mentor: 'Syamasundara', status: 'active',   menteeCount: 12 },
  ],

  settingsItems: [
    'Service Departments',
    'Course Categories',
    'Spiritual Masters',
    'Prabhupada Books',
    'Courses',
    'Curriculum Modules',
    'Morning Programme',
  ],

  adminSettingsLists: {
    'Service Departments': [
      { name: 'Bhakti Steps', active: true }, { name: 'Broadcast Services', active: true }, { name: 'Devotee Care Team', active: true },
      { name: 'Facilities & Maintenance', active: true }, { name: 'Festivals', active: true }, { name: 'Finance', active: true },
      { name: 'Food for Life', active: true }, { name: "Govinda's Restaurant", active: true }, { name: 'Guest Care Team', active: true },
      { name: "Krishna Club & Children's Events", active: true }, { name: 'London Community for Vaisnava Marriage', active: true },
      { name: 'London College of Vedic Studies', active: true }, { name: 'Nitya Seva', active: true }, { name: 'Pujari Department', active: true },
      { name: "Radha's Boutique", active: true }, { name: 'Reception', active: true }, { name: 'Russian-Speaking Community', active: true },
      { name: 'Sankirtan', active: true }, { name: 'SEVA Patron Care', active: true }, { name: 'Studio 108', active: true },
      { name: 'Sunday Feast', active: true }, { name: 'VISA', active: true }, { name: 'Volunteer Care', active: true },
      { name: 'Other', active: true },
    ],
    'Course Categories': [
      { name: 'Bhakti Shastri', active: true }, { name: 'Bhakti Vaibhava', active: true }, { name: 'Disciples Course', active: true },
      { name: 'Youth Programme', active: true }, { name: 'Grihastha Vision Team', active: true }, { name: 'Retreats', active: true },
    ],
    'Spiritual Masters': [
      { name: 'HH Sivarama Swami', active: true }, { name: 'HH Kadamba Kanana Swami', active: true },
      { name: 'HH Radhanath Swami', active: true }, { name: 'HH Sacinandana Swami', active: true },
      { name: 'HG Bhurijana Das', active: true },
    ],
    'Prabhupada Books': [
      { name: 'Bhagavad-gita As It Is', active: true }, { name: 'Sri Isopanishad', active: true },
      { name: 'Nectar of Devotion', active: true }, { name: 'Nectar of Instruction', active: true },
      { name: 'Teachings of Lord Caitanya', active: true }, { name: 'Teachings of Lord Kapila', active: true },
      { name: 'Teachings of Queen Kunti', active: true }, { name: 'Krsna, the Supreme Personality of Godhead', active: true },
      { name: 'Easy Journey to Other Planets', active: true }, { name: 'Beyond Birth and Death', active: true },
      { name: 'On the Way to Krsna', active: true }, { name: 'Raja-Vidya: The King of Knowledge', active: true },
      { name: 'Elevation to Krsna Consciousness', active: true }, { name: 'Krsna Consciousness: The Matchless Gift', active: true },
      { name: 'The Science of Self-Realization', active: true }, { name: 'Perfect Questions, Perfect Answers', active: true },
      { name: 'Journey of Self-Discovery', active: true }, { name: 'Narada Bhakti Sutra', active: true },
      { name: 'Mukunda-mala-stotra', active: true }, { name: 'Sri Caitanya Mahaprabhu: His Life and Precepts', active: true },
      { name: 'SB Canto 1.1', active: true }, { name: 'SB Canto 1.2', active: true }, { name: 'SB Canto 2', active: true },
      { name: 'SB Canto 3.1', active: true }, { name: 'SB Canto 3.2', active: true }, { name: 'SB Canto 3.3', active: true },
      { name: 'SB Canto 4.1', active: true }, { name: 'SB Canto 4.2', active: true }, { name: 'SB Canto 5', active: true },
      { name: 'SB Canto 6', active: true }, { name: 'SB Canto 7', active: true }, { name: 'SB Canto 8', active: true },
      { name: 'SB Canto 9', active: true }, { name: 'SB Canto 10.1', active: true }, { name: 'SB Canto 10.2', active: true },
      { name: 'SB Canto 10.3', active: true }, { name: 'SB Canto 11', active: true }, { name: 'SB Canto 12', active: true },
      { name: 'CC Adi-lila Vol. 1', active: true }, { name: 'CC Adi-lila Vol. 2', active: true },
      { name: 'CC Madhya-lila Vol. 1', active: true }, { name: 'CC Madhya-lila Vol. 2', active: true },
      { name: 'CC Madhya-lila Vol. 3', active: true }, { name: 'CC Madhya-lila Vol. 4', active: true },
      { name: 'CC Madhya-lila Vol. 5', active: true }, { name: 'CC Madhya-lila Vol. 6', active: true },
      { name: 'CC Madhya-lila Vol. 7', active: true }, { name: 'CC Madhya-lila Vol. 8', active: true },
      { name: 'CC Madhya-lila Vol. 9', active: true }, { name: 'CC Antya-lila Vol. 1', active: true },
      { name: 'CC Antya-lila Vol. 2', active: true }, { name: 'CC Antya-lila Vol. 3', active: true },
      { name: 'CC Antya-lila Vol. 4', active: true }, { name: 'CC Antya-lila Vol. 5', active: true },
    ],
    'Courses': [
      { name: 'ISKCON Disciples Course', active: true }, { name: 'Bhakti Shastri Module 1', active: true },
      { name: 'Bhakti Shastri Module 2', active: true }, { name: 'Grihastha Course', active: true },
      { name: 'Youth Preacher Training', active: true },
    ],
    'Curriculum Modules': [
      { name: 'Introduction to Bhakti', active: true }, { name: 'Japa Workshop', active: true },
      { name: 'Deity Worship Basics', active: true }, { name: 'Vaishnava Etiquette', active: true },
      { name: 'Book Distribution', active: true }, { name: 'Festival Organisation', active: true },
    ],
    'Morning Programme': [
      { name: 'Mangala Arati', active: true }, { name: 'Japa Meditation', active: true },
      { name: 'Guru Puja', active: true }, { name: 'Bhagavatam Class', active: true },
      { name: 'Tulasi Puja', active: true }, { name: 'Evening Kirtana', active: true },
    ],
  },

  adminKPIDrilldowns: {
    'Active Users': {
      breakdown: [
        { label: 'Mentees', value: 118 },
        { label: 'Mentors', value: 19 },
        { label: 'Admins', value: 5 },
      ],
      recent: [
        { name: 'Radha Patel', action: 'Joined', date: '28 Feb' },
        { name: 'Krishna Das', action: 'Joined', date: '26 Feb' },
        { name: 'Govinda Sharma', action: 'Joined', date: '25 Feb' },
      ],
    },
    'Submission Rate': {
      breakdown: [
        { label: 'Submitted today', value: 98 },
        { label: 'Not submitted', value: 28 },
        { label: 'On streak (7d+)', value: 64 },
      ],
      recent: [
        { name: 'Bhakti Steps Yr 1', action: '92% rate', date: 'Today' },
        { name: 'Bhakti Steps Yr 2', action: '68% rate', date: 'Today' },
        { name: 'Youth Group', action: '81% rate', date: 'Today' },
      ],
    },
    'Avg Score': {
      breakdown: [
        { label: '90+', value: 32 },
        { label: '70–89', value: 61 },
        { label: 'Below 70', value: 25 },
      ],
      recent: [
        { name: 'Top scorer', action: 'Ananda Patel — 96', date: 'Today' },
        { name: 'Most improved', action: 'David Smith — +12', date: 'This week' },
      ],
    },
    'Seva Hours': {
      breakdown: [
        { label: 'Guest Care', value: 86 },
        { label: 'Sunday Feast', value: 72 },
        { label: 'Sankirtan', value: 54 },
        { label: 'Other', value: 108 },
      ],
      recent: [
        { name: 'Most active', action: 'Priya Sharma — 18 hrs', date: 'This month' },
        { name: 'New volunteer', action: 'Radha Patel — 4 hrs', date: 'This week' },
      ],
    },
    'Course Completions': {
      breakdown: [
        { label: 'Approved', value: 15 },
        { label: 'Pending review', value: 3 },
        { label: 'Rejected', value: 1 },
      ],
      recent: [
        { name: 'David Smith', action: 'ISKCON Disciples Course', date: '18 Feb' },
        { name: 'Ananda Patel', action: 'Bhakti Shastri M1', date: '22 Feb' },
      ],
    },
    'Batch Health': {
      breakdown: [
        { label: 'Healthy (80%+)', value: 11 },
        { label: 'At risk', value: 1 },
        { label: 'Inactive', value: 0 },
      ],
      recent: [
        { name: 'Bhakti Steps Yr 1', action: '95% health', date: 'Current' },
        { name: 'Youth Group', action: '78% — at risk', date: 'Current' },
      ],
    },
  },

  // ─── Audit Log ──────────────────────────────────────
  auditLog: [
    { id: 1, actor: 'Govinda Das', action: 'Created user', target: 'Radha Devi', type: 'user', date: '28 Feb 2025, 14:30' },
    { id: 2, actor: 'Govinda Das', action: 'Approved batch', target: 'Bhakti Steps Yr 2', type: 'batch', date: '27 Feb 2025, 11:15' },
    { id: 3, actor: 'Syamasundara', action: 'Marked attendance', target: 'Japa Workshop Pt 3', type: 'attendance', date: '26 Feb 2025, 19:00' },
    { id: 4, actor: 'Syamasundara', action: 'Approved course', target: 'David Smith — IDC', type: 'course', date: '25 Feb 2025, 16:45' },
    { id: 5, actor: 'Govinda Das', action: 'Deactivated user', target: 'Old Devotee', type: 'user', date: '24 Feb 2025, 10:00' },
    { id: 6, actor: 'Govinda Das', action: 'Rejected batch', target: 'Intro Group', type: 'batch', date: '23 Feb 2025, 09:30' },
    { id: 7, actor: 'Syamasundara', action: 'Sent invite', target: 'newdevotee@example.com', type: 'invite', date: '22 Feb 2025, 13:20' },
    { id: 8, actor: 'Govinda Das', action: 'Changed role', target: 'Prabhava Das → admin', type: 'role', date: '20 Feb 2025, 11:00' },
    { id: 9, actor: 'Govinda Das', action: 'Created user', target: 'Ananda Das', type: 'user', date: '19 Feb 2025, 09:15' },
    { id: 10, actor: 'Syamasundara', action: 'Marked attendance', target: 'Gita Study Session 5', type: 'attendance', date: '18 Feb 2025, 19:30' },
    { id: 11, actor: 'Govinda Das', action: 'Approved batch', target: 'Youth Group', type: 'batch', date: '17 Feb 2025, 14:00' },
    { id: 12, actor: 'Syamasundara', action: 'Approved course', target: 'John — Bhakti Shastri', type: 'course', date: '16 Feb 2025, 10:30' },
    { id: 13, actor: 'Govinda Das', action: 'Sent invite', target: 'volunteer@temple.org', type: 'invite', date: '15 Feb 2025, 16:00' },
    { id: 14, actor: 'Govinda Das', action: 'Changed role', target: 'Syamasundara → mentor', type: 'role', date: '14 Feb 2025, 11:45' },
    { id: 15, actor: 'Syamasundara', action: 'Marked attendance', target: 'Sunday Feast Programme', type: 'attendance', date: '13 Feb 2025, 20:00' },
    { id: 16, actor: 'Govinda Das', action: 'Deactivated user', target: 'Inactive Volunteer', type: 'user', date: '12 Feb 2025, 08:30' },
    { id: 17, actor: 'Govinda Das', action: 'Approved batch', target: 'Bhakti Steps Yr 1', type: 'batch', date: '11 Feb 2025, 13:15' },
    { id: 18, actor: 'Syamasundara', action: 'Approved course', target: 'Radha Devi — IDC', type: 'course', date: '10 Feb 2025, 15:30' },
    { id: 19, actor: 'Govinda Das', action: 'Created user', target: 'Bhakta James', type: 'user', date: '9 Feb 2025, 10:00' },
    { id: 20, actor: 'Syamasundara', action: 'Marked attendance', target: 'Bhagavatam Class 12', type: 'attendance', date: '8 Feb 2025, 19:30' },
    { id: 21, actor: 'Govinda Das', action: 'Approved batch', target: 'Intro Group B', type: 'batch', date: '7 Feb 2025, 14:15' },
    { id: 22, actor: 'Govinda Das', action: 'Changed role', target: 'Madhava Das → mentor', type: 'role', date: '6 Feb 2025, 11:00' },
    { id: 23, actor: 'Syamasundara', action: 'Sent invite', target: 'newmember@temple.org', type: 'invite', date: '5 Feb 2025, 09:45' },
    { id: 24, actor: 'Govinda Das', action: 'Deactivated user', target: 'Former Volunteer', type: 'user', date: '4 Feb 2025, 16:30' },
    { id: 25, actor: 'Syamasundara', action: 'Approved course', target: 'Gaura Das — Bhakti Shastri', type: 'course', date: '3 Feb 2025, 13:00' },
    { id: 26, actor: 'Govinda Das', action: 'Rejected batch', target: 'Test Group', type: 'batch', date: '2 Feb 2025, 10:30' },
    { id: 27, actor: 'Syamasundara', action: 'Marked attendance', target: 'Japa Workshop Pt 4', type: 'attendance', date: '1 Feb 2025, 19:00' },
    { id: 28, actor: 'Govinda Das', action: 'Created user', target: 'Tulasi Devi', type: 'user', date: '31 Jan 2025, 08:15' },
    { id: 29, actor: 'Govinda Das', action: 'Sent invite', target: 'guest@iskcon.org', type: 'invite', date: '30 Jan 2025, 14:00' },
    { id: 30, actor: 'Syamasundara', action: 'Approved course', target: 'Ananda Patel — IDC', type: 'course', date: '29 Jan 2025, 11:30' },
    { id: 31, actor: 'Govinda Das', action: 'Changed role', target: 'Nitai Prabhu → mentor', type: 'role', date: '28 Jan 2025, 09:00' },
    { id: 32, actor: 'Syamasundara', action: 'Marked attendance', target: 'Sunday Programme', type: 'attendance', date: '27 Jan 2025, 20:15' },
    { id: 33, actor: 'Govinda Das', action: 'Approved batch', target: 'Senior Group', type: 'batch', date: '26 Jan 2025, 13:45' },
    { id: 34, actor: 'Govinda Das', action: 'Deactivated user', target: 'Temp Account', type: 'user', date: '25 Jan 2025, 10:00' },
    { id: 35, actor: 'Syamasundara', action: 'Sent invite', target: 'friend@example.com', type: 'invite', date: '24 Jan 2025, 15:30' },
    { id: 36, actor: 'Govinda Das', action: 'Created user', target: 'Rukmini Devi', type: 'user', date: '23 Jan 2025, 09:30' },
    { id: 37, actor: 'Syamasundara', action: 'Approved course', target: 'David Smith — Bhakti Shastri', type: 'course', date: '22 Jan 2025, 14:00' },
    { id: 38, actor: 'Govinda Das', action: 'Changed role', target: 'Balarama Das → mentor', type: 'role', date: '21 Jan 2025, 11:15' },
  ],

  // ─── Admin Growth Data ──────────────────────────────
  adminGrowthData: {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    activeUsers: [45, 62, 78, 95, 120, 142],
    submissionRate: [52, 58, 65, 71, 74, 78],
  },

  // ─── Admin Batch Options (for reassignment) ─────────
  adminBatchOptions: [
    { id: 'b1', name: 'Bhakti Steps Yr 1', mentor: 'Syamasundara' },
    { id: 'b2', name: 'Bhakti Steps Yr 2', mentor: 'Syamasundara' },
    { id: 'b3', name: 'Youth Group', mentor: 'Prabhava Das' },
  ],

  // ─── Admin Data Manager ─────────────────────────────
  adminTableNames: ['Sadhana Entries', 'Service Logs', 'Course Completions', 'Batch Memberships', 'User Profiles'],

  adminTableData: {
    'Sadhana Entries': [
      { id: 1, user: 'Bhakta John', date: '25 Feb', rounds: 16, score: 84, mood: 'steady', mangalaArati: false },
      { id: 2, user: 'David Smith', date: '25 Feb', rounds: 12, score: 64, mood: 'struggling', mangalaArati: true },
      { id: 3, user: 'Ananda Patel', date: '25 Feb', rounds: 16, score: 91, mood: 'inspired', mangalaArati: true },
      { id: 4, user: 'Bhakta John', date: '24 Feb', rounds: 14, score: 78, mood: 'steady', mangalaArati: true },
      { id: 5, user: 'Priya Sharma', date: '24 Feb', rounds: 10, score: 55, mood: 'struggling', mangalaArati: false },
      { id: 6, user: 'Gaura Das', date: '24 Feb', rounds: 16, score: 88, mood: 'blissful', mangalaArati: true },
    ],
    'Service Logs': [
      { id: 1, user: 'Bhakta John', date: '22 Feb', department: 'Guest Care Team', hours: 2.5, description: 'Welcomed guests' },
      { id: 2, user: 'David Smith', date: '16 Feb', department: 'Sunday Feast', hours: 3.0, description: 'Prepared lunch' },
      { id: 3, user: 'Ananda Patel', date: '20 Feb', department: 'Sankirtan', hours: 4.0, description: 'Book distribution' },
      { id: 4, user: 'Priya Sharma', date: '18 Feb', department: 'Pujari Department', hours: 1.5, description: 'Assisted with arati' },
    ],
    'Course Completions': [
      { id: 1, user: 'Bhakta John', course: 'Intro to Devotional Cooking', submitted: '20 Feb 2025', status: 'approved' },
      { id: 2, user: 'David Smith', course: 'Bhakti Shastri Module 1', submitted: '15 Feb 2025', status: 'pending' },
      { id: 3, user: 'Ananda Patel', course: 'Intro to Devotional Cooking', submitted: '12 Feb 2025', status: 'approved' },
    ],
    'Batch Memberships': [
      { id: 1, user: 'Bhakta John', batch: 'Bhakti Steps Yr 1', mentor: 'Syamasundara', joinDate: '1 Sep 2024', active: true },
      { id: 2, user: 'David Smith', batch: 'Bhakti Steps Yr 1', mentor: 'Syamasundara', joinDate: '1 Sep 2024', active: true },
      { id: 3, user: 'Ananda Patel', batch: 'Youth Group', mentor: 'Prabhava Das', joinDate: '15 Oct 2024', active: true },
      { id: 4, user: 'Priya Sharma', batch: 'Bhakti Steps Yr 1', mentor: 'Syamasundara', joinDate: '1 Sep 2024', active: false },
    ],
    'User Profiles': [
      { id: 1, name: 'Bhakta John', email: 'john@example.com', role: 'mentee', status: 'active', dateJoined: '1 Sep 2024' },
      { id: 2, name: 'David Smith', email: 'david@example.com', role: 'mentee', status: 'active', dateJoined: '1 Sep 2024' },
      { id: 3, name: 'Syamasundara', email: 'syama@example.com', role: 'mentor', status: 'active', dateJoined: '5 Jun 2023' },
      { id: 4, name: 'Govinda Das', email: 'admin@iskcon.london', role: 'admin', status: 'active', dateJoined: '1 Jan 2023' },
      { id: 5, name: 'Prabhava Das', email: 'prabhava@iskcon.london', role: 'mentor', status: 'active', dateJoined: '10 Mar 2024' },
    ],
  },

  adminTableFields: {
    'Sadhana Entries': [
      { key: 'user', label: 'User', type: 'text', editable: false },
      { key: 'date', label: 'Date', type: 'text', editable: true },
      { key: 'rounds', label: 'Rounds', type: 'number', min: 0, max: 192, editable: true },
      { key: 'score', label: 'Score', type: 'number', min: 0, max: 100, editable: true },
      { key: 'mood', label: 'Mood', type: 'select', options: ['struggling', 'steady', 'inspired', 'blissful'], editable: true },
      { key: 'mangalaArati', label: 'Mangala Arati', type: 'boolean', editable: true },
    ],
    'Service Logs': [
      { key: 'user', label: 'User', type: 'text', editable: false },
      { key: 'date', label: 'Date', type: 'text', editable: true },
      { key: 'department', label: 'Department', type: 'text', editable: true },
      { key: 'hours', label: 'Hours', type: 'number', min: 0, max: 24, editable: true },
      { key: 'description', label: 'Description', type: 'text', editable: true },
    ],
    'Course Completions': [
      { key: 'user', label: 'User', type: 'text', editable: false },
      { key: 'course', label: 'Course', type: 'text', editable: true },
      { key: 'submitted', label: 'Submitted', type: 'text', editable: true },
      { key: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'], editable: true },
    ],
    'Batch Memberships': [
      { key: 'user', label: 'User', type: 'text', editable: false },
      { key: 'batch', label: 'Batch', type: 'text', editable: true },
      { key: 'mentor', label: 'Mentor', type: 'text', editable: true },
      { key: 'joinDate', label: 'Join Date', type: 'text', editable: true },
      { key: 'active', label: 'Active', type: 'boolean', editable: true },
    ],
    'User Profiles': [
      { key: 'name', label: 'Name', type: 'text', editable: true },
      { key: 'email', label: 'Email', type: 'text', editable: true },
      { key: 'role', label: 'Role', type: 'select', options: ['mentee', 'mentor', 'admin'], editable: true },
      { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'inactive'], editable: true },
      { key: 'dateJoined', label: 'Date Joined', type: 'text', editable: false },
    ],
  },
};

export default MockData;