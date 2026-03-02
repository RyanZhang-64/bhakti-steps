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
    dateInitiated: null,
    initiatedName: null,
    spiritualMaster: null,
    japaTarget: 16,
  },

  /* ═══════════════════════════════════════════════════════ */
  /* MENTOR DATA                                             */
  /* ═══════════════════════════════════════════════════════ */

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
    streak: 0,
    notes: [
      { date: '20 Feb, 19:45', text: 'David mentioned he is struggling to wake up for morning programme.' },
      { date: '13 Feb, 20:10', text: 'Good session today. David asked insightful questions about japa concentration.' },
    ],
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
  ],

  adminSettingsLists: {
    'Service Departments': [
      'Bhakti Steps', 'Broadcast Services', 'Devotee Care Team', 'Facilities & Maintenance',
      'Festivals', 'Finance', 'Food for Life', "Govinda's Restaurant", 'Guest Care Team',
      "Krishna Club & Children's Events", 'London Community for Vaisnava Marriage',
      'London College of Vedic Studies', 'Nitya Seva', 'Pujari Department', "Radha's Boutique",
      'Reception', 'Russian-Speaking Community', 'Sankirtan', 'SEVA Patron Care', 'Studio 108',
      'Sunday Feast', 'VISA', 'Volunteer Care', 'Other',
    ],
    'Course Categories': [
      'Bhakti Shastri', 'Bhakti Vaibhava', 'Disciples Course', 'Youth Programme',
      'Grihastha Vision Team', 'Retreats',
    ],
    'Spiritual Masters': [
      'HH Sivarama Swami', 'HH Kadamba Kanana Swami', 'HH Radhanath Swami',
      'HH Sacinandana Swami', 'HG Bhurijana Das',
    ],
    'Prabhupada Books': [
      'Bhagavad-gita As It Is', 'Sri Isopanishad',
      'Nectar of Devotion', 'Nectar of Instruction', 'Teachings of Lord Caitanya',
      'Teachings of Lord Kapila', 'Teachings of Queen Kunti',
      'Krsna, the Supreme Personality of Godhead', 'Easy Journey to Other Planets',
      'Beyond Birth and Death', 'On the Way to Krsna', 'Raja-Vidya: The King of Knowledge',
      'Elevation to Krsna Consciousness', 'Krsna Consciousness: The Matchless Gift',
      'The Science of Self-Realization', 'Perfect Questions, Perfect Answers',
      'Journey of Self-Discovery', 'Narada Bhakti Sutra', 'Mukunda-mala-stotra',
      'Sri Caitanya Mahaprabhu: His Life and Precepts',
      'SB Canto 1.1', 'SB Canto 1.2', 'SB Canto 2', 'SB Canto 3.1', 'SB Canto 3.2', 'SB Canto 3.3',
      'SB Canto 4.1', 'SB Canto 4.2', 'SB Canto 5', 'SB Canto 6', 'SB Canto 7', 'SB Canto 8',
      'SB Canto 9', 'SB Canto 10.1', 'SB Canto 10.2', 'SB Canto 10.3', 'SB Canto 11', 'SB Canto 12',
      'CC Adi-lila Vol. 1', 'CC Adi-lila Vol. 2',
      'CC Madhya-lila Vol. 1', 'CC Madhya-lila Vol. 2', 'CC Madhya-lila Vol. 3',
      'CC Madhya-lila Vol. 4', 'CC Madhya-lila Vol. 5', 'CC Madhya-lila Vol. 6',
      'CC Madhya-lila Vol. 7', 'CC Madhya-lila Vol. 8', 'CC Madhya-lila Vol. 9',
      'CC Antya-lila Vol. 1', 'CC Antya-lila Vol. 2', 'CC Antya-lila Vol. 3',
      'CC Antya-lila Vol. 4', 'CC Antya-lila Vol. 5',
    ],
    'Courses': [
      'ISKCON Disciples Course', 'Bhakti Shastri Module 1', 'Bhakti Shastri Module 2',
      'Grihastha Course', 'Youth Preacher Training',
    ],
    'Curriculum Modules': [
      'Introduction to Bhakti', 'Japa Workshop', 'Deity Worship Basics',
      'Vaishnava Etiquette', 'Book Distribution', 'Festival Organisation',
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
};

export default MockData;