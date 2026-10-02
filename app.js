'use strict';
/* ============================================================
   Ever After — Premium Wedding Planner
   app.js · core: utils, icons, store, theme, ui primitives, router
   ============================================================ */

/* ---------------- utils ---------------- */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const uid = () => 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return esc(iso);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
function fmtTime(t) {
  if (!t) return '—';
  let [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}
const fmtMoney = n => '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
function daysUntil(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, d); target.setHours(23, 59, 59, 999);
  return Math.ceil((target - Date.now()) / 86400000);
}
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

/* ---------------- icons (inline SVG, single style) ---------------- */
const ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  checklist: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  tasks: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h6"/>',
  wallet: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  store: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  card: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/>',
  shirt: '<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
  flower: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  palette: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
  note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  gift: '<path d="M20 12v10H4V12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
};
function icon(n, s = 18) {
  return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
}

/* ---------------- sections registry ---------------- */
const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home' },
  { id: 'details', label: 'Wedding Details', icon: 'heart' },
  { id: 'checklist', label: 'Checklist', icon: 'checklist' },
  { id: 'tasks', label: 'Tasks', icon: 'tasks' },
  { id: 'budget', label: 'Budget', icon: 'wallet' },
  { id: 'guests', label: 'Guests', icon: 'users' },
  { id: 'seating', label: 'Seating', icon: 'grid' },
  { id: 'vendors', label: 'Vendors', icon: 'store' },
  { id: 'payments', label: 'Payments', icon: 'card' },
  { id: 'timeline', label: 'Timeline', icon: 'clock' },
  { id: 'invitations', label: 'Invitations', icon: 'mail' },
  { id: 'attire', label: 'Attire', icon: 'shirt' },
  { id: 'flowers', label: 'Flowers & Decor', icon: 'flower' },
  { id: 'moodboard', label: 'Mood Board', icon: 'image' },
  { id: 'palette', label: 'Color Palette', icon: 'palette' },
  { id: 'honeymoon', label: 'Honeymoon', icon: 'send' },
  { id: 'notes', label: 'Notes', icon: 'note' },
  { id: 'settings', label: 'Settings', icon: 'gear' }
];

/* ---------------- sample data ---------------- */
function isoPlus(days) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function sampleData() {
  const G = (name, group, rsvp, partySize, extra = {}) => Object.assign(
    { id: uid(), name, email: '', phone: '', address: '', group, rsvp, partySize, meal: 'Standard', dietary: '', table: '', inviteSent: true, rsvpDate: '', gift: '', notes: '' }, extra);
  const guests = [
    G('Emma Thompson', 'Bride\'s Family', 'Attending', 2, { email: 'emma.t@example.com', meal: 'Vegetarian' }),
    G('James Thompson', 'Bride\'s Family', 'Attending', 2),
    G('Olivia Carter', 'Groom\'s Family', 'Attending', 3),
    G('Noah Carter', 'Groom\'s Family', 'Pending', 2),
    G('Sophia Martinez', 'Friends', 'Attending', 1, { meal: 'Vegan', dietary: 'Nut allergy' }),
    G('Liam Johnson', 'Friends', 'Attending', 2),
    G('Ava Williams', 'Friends', 'Maybe', 1),
    G('Mason Brown', 'College', 'Not Attending', 1),
    G('Isabella Davis', 'College', 'Pending', 2),
    G('Ethan Miller', 'Work', 'Attending', 1, { meal: 'Gluten-free' }),
    G('Mia Wilson', 'Work', 'Pending', 1),
    G('Grandma Rose', 'Bride\'s Family', 'Attending', 1, { dietary: 'Soft foods', notes: 'Needs ground-floor seating' })
  ];
  const T = (name, category, dueIn, priority, status, assignee = '') =>
    ({ id: uid(), name, category, due: isoPlus(dueIn), priority, status, notes: '', assignee });
  const V = (type, name, company, price, deposit, paid, dueIn, contract, extra = {}) => Object.assign(
    { id: uid(), type, name, company, phone: '', email: '', website: '', price, deposit, paid, due: dueIn == null ? '' : isoPlus(dueIn), contract, notes: '' }, extra);
  const vendors = [
    V('Venue', 'Sarah Mitchell', 'Rosewood Gardens', 8000, 2000, 2000, 60, 'Signed', { phone: '(555) 123-4567' }),
    V('Photographer', 'David Chen', 'Everlasting Moments', 3500, 1000, 1000, 30, 'Signed'),
    V('Caterer', 'Maria Garcia', 'Golden Fork Catering', 9000, 2500, 1000, 45, 'Signed'),
    V('Florist', 'Emily White', 'Petal & Stem', 2200, 500, 500, 50, 'Draft'),
    V('DJ', 'Alex Rivera', 'BeatDrop Entertainment', 1500, 400, 0, 40, 'Sent'),
    V('Cake', 'Sophie Laurent', 'Sweet Layers', 800, 200, 200, 55, 'Signed')
  ];
  const budgetCats = [
    ['Venue', 8500, 8000], ['Catering', 9500, 9000], ['Photography', 3500, 3500],
    ['Videography', 2800, 0], ['Dress', 2200, 1800], ['Suit/Tuxedo', 900, 0],
    ['Rings', 1500, 1200], ['Flowers', 2200, 2200], ['Decorations', 1800, 600],
    ['Invitations', 600, 450], ['Music/DJ', 1500, 1500], ['Transportation', 800, 0],
    ['Cake', 800, 800], ['Hair & Makeup', 700, 0], ['Rentals', 1200, 0],
    ['Honeymoon', 4000, 0], ['Miscellaneous', 1000, 320]
  ].map(([name, estimated, actual]) => ({ id: uid(), name, estimated, actual, deposit: 0, due: '' }));
  const CHECK_SECTIONS = ['12+ Months Before', '9–12 Months Before', '6–9 Months Before', '3–6 Months Before', '1–3 Months Before', 'Final Month', 'Wedding Week', 'Wedding Day', 'After Wedding'];
  const CHECK_PRESETS = {
    '12+ Months Before': ['Set your wedding budget', 'Draft the guest list', 'Choose your wedding date', 'Book your venue', 'Hire a wedding planner', 'Start wedding dress shopping'],
    '9–12 Months Before': ['Book photographer', 'Book videographer', 'Book caterer', 'Choose your wedding party', 'Start your gift registry', 'Book entertainment (DJ/band)'],
    '6–9 Months Before': ['Order invitations', 'Book florist', 'Book cake baker', 'Plan the honeymoon', 'Buy wedding bands', 'Book transportation'],
    '3–6 Months Before': ['Send invitations', 'Plan ceremony details', 'Order wedding favors', 'Finalize the menu', 'Hair & makeup trial', 'Buy accessories'],
    '1–3 Months Before': ['Final dress fitting', 'Apply for marriage license', 'Finalize day-of timeline', 'Confirm all vendors', 'Create seating plan'],
    'Final Month': ['Final venue walkthrough', 'Confirm final headcount', 'Pick up wedding attire', 'Pack the emergency kit'],
    'Wedding Week': ['Confirm all vendors once more', 'Delegate day-of tasks', 'Rehearsal & rehearsal dinner', 'Rest and hydrate'],
    'Wedding Day': ['Eat a good breakfast', 'Hair & makeup', 'Get dressed', 'Enjoy every single moment'],
    'After Wedding': ['Send thank-you notes', 'Preserve the wedding dress', 'Update names & documents', 'Leave vendor reviews']
  };
  const checklist = [];
  CHECK_SECTIONS.forEach((sec, si) => {
    CHECK_PRESETS[sec].forEach((text, ti) => {
      checklist.push({ id: uid(), section: sec, text, done: si === 0 && ti < 3, due: '', assignee: '' });
    });
  });
  const TL = (time, name, location, duration, notes = '') => ({ id: uid(), time, name, location, duration, notes });
  return {
    settings: {
      bride: 'Ava Sinclair', groom: 'Liam Carter', weddingDate: isoPlus(240),
      ceremonyTime: '14:00', receptionTime: '17:00', venue: 'Rosewood Gardens',
      location: 'Napa Valley, California', style: 'Garden Romance', notes: 'Outdoor ceremony, golden hour photos.',
      theme: 'light'
    },
    checklist,
    tasks: [
      T('Book wedding videographer', 'Vendors', 150, 'High', 'Not Started', 'Ava'),
      T('Finalize catering menu tasting', 'Catering', 90, 'High', 'In Progress', 'Liam'),
      T('Order wedding invitations', 'Invitations', 120, 'Medium', 'Not Started', 'Ava'),
      T('Apply for marriage license', 'Legal', 25, 'High', 'Not Started'),
      T('Confirm florist delivery times', 'Flowers', 40, 'Medium', 'In Progress', 'Ava'),
      T('Book honeymoon flights', 'Honeymoon', 100, 'Medium', 'Not Started', 'Liam'),
      T('Choose first dance song', 'Music', 60, 'Low', 'Completed'),
      T('Send save-the-dates', 'Guests', -20, 'High', 'Completed', 'Ava')
    ],
    budget: { total: 45000, categories: budgetCats },
    guests,
    tables: [
      { id: uid(), name: 'Table 1', type: 'round', seats: 8 },
      { id: uid(), name: 'Table 2', type: 'round', seats: 8 },
      { id: uid(), name: 'Sweetheart Table', type: 'sweetheart', seats: 2 }
    ],
    vendors,
    payments: vendors.filter(v => v.price - v.paid > 0).map(v => ({
      id: uid(), vendor: v.company, total: v.price, deposit: v.deposit, paid: v.paid,
      due: v.due, status: v.paid >= v.price ? 'Paid' : (v.paid > 0 ? 'Partial' : 'Unpaid')
    })),
    timeline: [
      TL('09:00', 'Getting Ready', 'Bridal Suite', '90 min', 'Breakfast + mimosas'),
      TL('09:30', 'Hair & Makeup', 'Bridal Suite', '120 min'),
      TL('12:30', 'First Look', 'Garden Gazebo', '30 min', 'Private moment + photos'),
      TL('14:00', 'Ceremony', 'Rose Garden', '45 min'),
      TL('15:00', 'Photos', 'Grounds', '60 min', 'Family + wedding party'),
      TL('16:00', 'Cocktail Hour', 'Terrace', '60 min'),
      TL('17:00', 'Reception', 'Grand Hall', '300 min'),
      TL('18:00', 'Dinner', 'Grand Hall', '90 min'),
      TL('19:00', 'Speeches', 'Grand Hall', '30 min'),
      TL('19:45', 'First Dance', 'Dance Floor', '5 min'),
      TL('20:15', 'Cake Cutting', 'Cake Table', '15 min'),
      TL('20:45', 'Bouquet Toss', 'Dance Floor', '10 min'),
      TL('22:00', 'Grand Exit', 'Main Entrance', '15 min', 'Sparkler send-off')
    ],
    attire: {
      bride: ['Dress', 'Shoes', 'Jewelry', 'Veil', 'Accessories', 'Alterations'].map(n => ({ id: uid(), name: n, status: 'Not Started' })),
      groom: ['Suit/Tuxedo', 'Shoes', 'Tie/Bow Tie', 'Watch', 'Accessories'].map(n => ({ id: uid(), name: n, status: 'Not Started' })),
      party: ['Bridesmaid Dresses', 'Groomsmen Suits', 'Flower Girl Dress', 'Ring Bearer Outfit'].map(n => ({ id: uid(), name: n, status: 'Not Started' }))
    },
    flowers: ['Bridal Bouquet', 'Bridesmaid Bouquets', 'Boutonnieres', 'Ceremony Flowers', 'Reception Centerpieces', 'Table Decor', 'Arch', 'Candles', 'Signage', 'Other Decorations']
      .map((n, i) => ({ id: uid(), name: n, estimated: [350, 240, 120, 800, 900, 400, 600, 150, 200, 0][i], actual: 0 })),
    moodboard: [
      { id: uid(), category: 'Colors', label: 'Blush & sage palette', url: '' },
      { id: uid(), category: 'Flowers', label: 'Garden roses bouquet', url: '' },
      { id: uid(), category: 'Decor', label: 'Candlelit reception', url: '' },
      { id: uid(), category: 'Cakes', label: 'Three-tier floral cake', url: '' }
    ],
    palette: [
      { id: uid(), name: 'Dusty Rose', hex: '#B76E79' },
      { id: uid(), name: 'Champagne', hex: '#D9C7A7' },
      { id: uid(), name: 'Sage', hex: '#9CAF88' },
      { id: uid(), name: 'Warm Ivory', hex: '#FAF6F0' },
      { id: uid(), name: 'Muted Gold', hex: '#B9975B' }
    ],
    honeymoon: {
      destination: 'Santorini, Greece', startDate: isoPlus(248), endDate: isoPlus(258),
      flights: 'Booked — Aegean Air', hotel: 'Canaves Oia Suites', transport: 'ATV rental',
      activities: 'Catamaran sunset cruise, Akrotiri ruins, wine tasting',
      budget: 4000, bookingStatus: 'In Progress',
      packing: ['Passports', 'Sunscreen', 'Evening outfits', 'Camera', 'Travel insurance docs'].map(t => ({ id: uid(), text: t, done: false }))
    },
    emergency: ['Emergency sewing kit', 'Safety pins', 'Makeup touch-up kit', 'Tissues', 'Phone charger', 'Pain reliever', 'Snacks', 'Water bottles', 'Stain remover pen', 'Hair pins', 'Fashion tape']
      .map(t => ({ id: uid(), text: t, done: false })),
    notes: [
      { id: uid(), title: 'Venue walkthrough notes', body: 'Garden ceremony site fits 120. Backup indoor hall available. Load-in from 8am.', category: 'Venue', updatedAt: Date.now() },
      { id: uid(), title: 'Photographer shot list', body: 'Must-haves: first look, parents, golden hour couple portraits, sparkler exit.', category: 'Vendors', updatedAt: Date.now() },
      { id: uid(), title: 'Menu ideas', body: 'Passed apps: burrata crostini, tuna tartare. Consider late-night donut wall.', category: 'Budget', updatedAt: Date.now() }
    ]
  };
}

/* ---------------- store ---------------- */
const LS_KEY = 'twp_data_v1';
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return (d && d.settings) ? d : null;
  } catch { return null; }
}
let state = loadState() || sampleData();
function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
  catch (e) { toast('Could not save — storage is full', 'alert'); }
}

/* ---------------- theme ---------------- */
function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme || 'light';
  $('#themeToggle').innerHTML = icon(state.settings.theme === 'dark' ? 'sun' : 'moon', 18);
}
function toggleTheme() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  save(); applyTheme();
}

/* ---------------- toast / modal / confirm ---------------- */
function toast(msg, ic = 'check') {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = icon(ic, 16) + '<span>' + esc(msg) + '</span>';
  $('#toastWrap').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 320); }, 2400);
}
function openModal(title, bodyHTML, { submitLabel = 'Save', danger = false, onSubmit = null, wide = false } = {}) {
  closeModal();
  const root = $('#modalRoot');
  const ov = document.createElement('div');
  ov.className = 'modal-overlay'; ov.id = 'modalOverlay';
  ov.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" ${wide ? 'style="width:min(720px,100%)"' : ''}>
      <div class="modal-head"><h3>${esc(title)}</h3><button class="icon-btn" id="modalClose" aria-label="Close">${icon('x', 16)}</button></div>
      <form id="modalForm" novalidate>
        <div class="modal-body">${bodyHTML}<div class="field invalid" id="modalErr" style="display:none"><div class="error-msg" style="display:block"></div></div></div>
        <div class="modal-foot">
          <button type="button" class="btn" id="modalCancel">Cancel</button>
          <button type="submit" class="btn ${danger ? 'btn-danger' : 'btn-primary'}">${esc(submitLabel)}</button>
        </div>
      </form>
    </div>`;
  root.appendChild(ov);
  const close = () => ov.remove();
  ov.addEventListener('mousedown', e => { if (e.target === ov) close(); });
  $('#modalClose', ov).onclick = close;
  $('#modalCancel', ov).onclick = close;
  document.addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc2); } });
  const form = $('#modalForm', ov);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (k in data) { if (!Array.isArray(data[k])) data[k] = [data[k]]; data[k].push(v); }
      else data[k] = v;
    });
    $$('input[type="checkbox"][data-bool]', form).forEach(cb => { data[cb.name] = cb.checked; });
    const errBox = $('#modalErr', ov);
    const err = onSubmit ? onSubmit(data, form) : null;
    if (err) { errBox.style.display = 'block'; $('.error-msg', errBox).textContent = err; }
    else close();
  });
  const first = $('input, select, textarea', form);
  if (first) setTimeout(() => first.focus(), 60);
}
function closeModal() { const o = $('#modalOverlay'); if (o) o.remove(); }
function confirmAction(message, onYes, yesLabel = 'Delete') {
  openModal('Please confirm', `<p class="muted">${esc(message)}</p>`, {
    submitLabel: yesLabel, danger: true,
    onSubmit: () => { onYes(); toast('Deleted'); return null; }
  });
}

/* ---------------- small render helpers ---------------- */
function badge(text, tone = 'gray') { return `<span class="badge ${tone}">${esc(text)}</span>`; }
function progressBar(pct, thin = false) {
  return `<div class="progress${thin ? ' thin' : ''}"><span style="width:${clamp(Math.round(pct), 0, 100)}%"></span></div>`;
}
function emptyState(ic, title, text, btnLabel, onClickId) {
  return `<div class="empty-state">${icon(ic, 40)}<h3>${esc(title)}</h3><p>${esc(text)}</p>
    ${btnLabel ? `<button class="btn btn-primary" data-act="${onClickId}">${icon('plus', 15)} ${esc(btnLabel)}</button>` : ''}</div>`;
}
function sectionHead(title, sub, actionsHTML = '') {
  return `<div class="section-head"><div><h2>${esc(title)}</h2><p class="sub">${sub}</p></div>
    <div class="actions-row">${actionsHTML}</div></div>`;
}
function rsvpTone(r) { return r === 'Attending' ? 'green' : r === 'Not Attending' ? 'red' : r === 'Maybe' ? 'amber' : 'gray'; }
function priTone(p) { return p === 'High' ? 'red' : p === 'Medium' ? 'amber' : 'gray'; }
function statusTone(s) { return s === 'Completed' || s === 'Paid' || s === 'Attending' || s === 'Signed' ? 'green' : s === 'In Progress' || s === 'Partial' ? 'blue' : s === 'Overdue' || s === 'Unpaid' ? 'red' : 'gray'; }
function tableName(id) { const t = state.tables.find(t => t.id === id); return t ? t.name : '—'; }

/* ---------------- reminders engine ---------------- */
function getReminders() {
  const out = []; const t = todayISO();
  const soon = isoPlus(14);
  state.tasks.forEach(x => {
    if (x.status === 'Completed' || !x.due) return;
    if (x.due < t) out.push({ tone: 'red', ic: 'alert', title: `Overdue task: ${x.name}`, sub: `Was due ${fmtDate(x.due)}`, go: 'tasks' });
    else if (x.due <= isoPlus(7)) out.push({ tone: 'amber', ic: 'clock', title: `Task due soon: ${x.name}`, sub: `Due ${fmtDate(x.due)}`, go: 'tasks' });
  });
  state.payments.forEach(p => {
    const bal = (Number(p.total) || 0) - (Number(p.paid) || 0);
    if (bal <= 0 || !p.due) return;
    if (p.due < t) out.push({ tone: 'red', ic: 'card', title: `Payment overdue: ${p.vendor}`, sub: `${fmtMoney(bal)} was due ${fmtDate(p.due)}`, go: 'payments' });
    else if (p.due <= soon) out.push({ tone: 'amber', ic: 'card', title: `Payment due: ${p.vendor}`, sub: `${fmtMoney(bal)} due ${fmtDate(p.due)}`, go: 'payments' });
  });
  state.checklist.forEach(c => {
    if (!c.done && c.due && c.due < t) out.push({ tone: 'red', ic: 'checklist', title: `Checklist overdue: ${c.text}`, sub: `${c.section} · was due ${fmtDate(c.due)}`, go: 'checklist' });
  });
  const d = daysUntil(state.settings.weddingDate);
  if (d != null && d >= 0) [60, 30, 14, 7, 1].forEach(m => { if (d === m) out.push({ tone: 'gold', ic: 'heart', title: m === 1 ? 'Tomorrow is the wedding!' : `${m} days to go!`, sub: 'Final preparations time', go: 'dashboard' }); });
  return out.slice(0, 12);
}

/* ---------------- global search ---------------- */
const sectionQuery = {};
function globalSearch(q) {
  const box = $('#searchResults');
  q = q.trim().toLowerCase();
  if (q.length < 2) { box.hidden = true; return; }
  const res = [];
  const push = (kind, label, sub, go, sec, query) => res.push({ kind, label, sub, go, sec, query });
  state.guests.forEach(g => { if ((g.name + ' ' + (g.email || '')).toLowerCase().includes(q)) push('Guest', g.name, g.group || '', 'guests', 'guests', g.name); });
  state.vendors.forEach(v => { if ((v.company + ' ' + v.name + ' ' + v.type).toLowerCase().includes(q)) push('Vendor', v.company, v.type, 'vendors', 'vendors', v.company); });
  state.tasks.forEach(x => { if (x.name.toLowerCase().includes(q)) push('Task', x.name, x.category || '', 'tasks', 'tasks', x.name); });
  state.notes.forEach(n => { if ((n.title + ' ' + n.body).toLowerCase().includes(q)) push('Note', n.title, n.category, 'notes', 'notes', n.title); });
  state.payments.forEach(p => { if (p.vendor.toLowerCase().includes(q)) push('Payment', p.vendor, fmtMoney((+p.total || 0) - (+p.paid || 0)) + ' due', 'payments', 'payments', ''); });
  state.timeline.forEach(e => { if (e.name.toLowerCase().includes(q)) push('Timeline', e.name, fmtTime(e.time), 'timeline', 'timeline', ''); });
  box.innerHTML = res.length
    ? res.slice(0, 10).map((r, i) => `<button data-i="${i}">${icon('search', 14)}<span><strong>${esc(r.label)}</strong><br><small class="muted">${esc(r.sub)}</small></span><span class="kind">${r.kind}</span></button>`).join('')
    : `<div style="padding:14px" class="muted small">No matches found.</div>`;
  box.hidden = false;
  $$('button', box).forEach(b => b.onclick = () => {
    const r = res[+b.dataset.i]; box.hidden = true; $('#globalSearch').value = '';
    if (r.query) sectionQuery[r.sec] = r.query;
    showSection(r.go);
  });
}

/* ---------------- router + nav ---------------- */
const RENDER = {};
let currentSection = 'dashboard';
let tickers = [];
function clearTickers() { tickers.forEach(clearInterval); tickers = []; }
function showSection(id) {
  clearTickers();
  currentSection = id;
  $$('#sidebar .nav-item').forEach(b => b.classList.toggle('active', b.dataset.sec === id));
  $$('#mobileNav .mn-item').forEach(b => b.classList.toggle('active', b.dataset.sec === id));
  $('#moreSheet').classList.remove('open');
  const fn = RENDER[id];
  $('#view').innerHTML = fn ? fn() : '<p>Section not found.</p>';
  if (fn && fn.after) fn.after();
  $('#view').scrollTop = 0; window.scrollTo(0, 0);
}
const MOBILE_TABS = ['dashboard', 'checklist', 'guests', 'budget', 'more'];
function renderNav() {
  const groups = [
    { label: 'Plan', ids: ['dashboard', 'details', 'checklist', 'tasks', 'timeline'] },
    { label: 'People', ids: ['guests', 'seating', 'invitations', 'vendors'] },
    { label: 'Money', ids: ['budget', 'payments'] },
    { label: 'Style', ids: ['attire', 'flowers', 'moodboard', 'palette'] },
    { label: 'More', ids: ['honeymoon', 'notes', 'settings'] }
  ];
  const byId = Object.fromEntries(SECTIONS.map(s => [s.id, s]));
  $('#sidebar').innerHTML = groups.map(g =>
    `<div class="nav-group-label">${g.label}</div>` +
    g.ids.map(id => `<button class="nav-item" data-sec="${id}">${icon(byId[id].icon)}<span>${byId[id].label}</span></button>`).join('')
  ).join('');
  $('#mobileNav').innerHTML = MOBILE_TABS.map(id => {
    if (id === 'more') return `<button class="mn-item" data-more="1">${icon('more', 20)}<span>More</span></button>`;
    const s = byId[id];
    return `<button class="mn-item" data-sec="${id}">${icon(s.icon, 20)}<span>${s.label.split(' ')[0]}</span></button>`;
  }).join('');
  $('#moreSheetBody').innerHTML = `<h3 style="margin-bottom:8px">All sections</h3>` + groups.map(g =>
    `<div class="nav-group-label">${g.label}</div>` +
    g.ids.map(id => `<button class="nav-item" data-sec="${id}">${icon(byId[id].icon)}<span>${byId[id].label}</span></button>`).join('')
  ).join('');
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-sec]');
    if (nav) { showSection(nav.dataset.sec); return; }
    if (e.target.closest('[data-more]')) { $('#moreSheet').classList.add('open'); return; }
    if (e.target.closest('#moreSheet') && !e.target.closest('.sheet')) $('#moreSheet').classList.remove('open');
  });
}

/* ---------------- header wiring ---------------- */
function wireHeader() {
  $('#brandMark').innerHTML = icon('heart', 20);
  $('#searchIcon').innerHTML = icon('search', 16);
  $('#printBtn').innerHTML = icon('printer', 18);
  $('#printBtn').onclick = () => window.print();
  $('#themeToggle').onclick = toggleTheme;
  const si = $('#globalSearch');
  si.addEventListener('input', debounce(() => globalSearch(si.value), 180));
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) $('#searchResults').hidden = true;
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); si.focus(); }
  });
}

/* ---------------- export / import ---------------- */
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'wedding-planner-backup-' + todayISO() + '.json';
  a.click(); URL.revokeObjectURL(a.href);
  toast('Backup downloaded');
}
function importData(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      if (!d.settings) throw new Error('bad file');
      state = d; save(); applyTheme(); showSection('dashboard');
      toast('Data imported');
    } catch { toast('That file is not a valid backup', 'alert'); }
  };
  r.readAsText(file);
}

/* ============================================================
   Dashboard + Wedding Details
   ============================================================ */
function nyNow() {
  try {
    const f = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZoneName: 'short'
    });
    return f.format(new Date());
  } catch { return new Date().toLocaleString(); }
}
function weddingTarget() {
  const s = state.settings;
  if (!s.weddingDate) return null;
  const [y, m, d] = s.weddingDate.split('-').map(Number);
  const [hh, mm] = (s.ceremonyTime || '12:00').split(':').map(Number);
  return new Date(y, m - 1, d, hh || 12, mm || 0);
}
function countdownParts() {
  const t = weddingTarget();
  if (!t) return null;
  let diff = t - Date.now();
  if (diff < 0) return { passed: true };
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d, h, m, s };
}
function overallProgress() {
  const pct = a => a.length ? a.filter(x => x).length / a.length * 100 : 100;
  const parts = [
    pct(state.checklist.map(c => c.done)),
    pct(state.tasks.map(t => t.status === 'Completed')),
    pct(state.vendors.map(v => v.contract === 'Signed')),
    pct(state.guests.map(g => g.inviteSent))
  ];
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
}
function budgetTotals() {
  const total = Number(state.budget.total) || 0;
  const actual = state.budget.categories.reduce((a, c) => a + (Number(c.actual) || 0), 0);
  const estimated = state.budget.categories.reduce((a, c) => a + (Number(c.estimated) || 0), 0);
  return { total, actual, estimated, remaining: total - actual };
}
function guestStats() {
  let invited = 0, attending = 0, pending = 0, declined = 0;
  state.guests.forEach(g => {
    const n = Number(g.partySize) || 1;
    invited += n;
    if (g.rsvp === 'Attending') attending += n;
    else if (g.rsvp === 'Not Attending') declined += n;
    else pending += n;
  });
  return { invited, attending, pending, declined, count: state.guests.length };
}

RENDER.dashboard = function () {
  const s = state.settings;
  const cd = countdownParts();
  const bt = budgetTotals();
  const gs = guestStats();
  const tasksLeft = state.tasks.filter(t => t.status !== 'Completed').length;
  const prog = overallProgress();
  const rems = getReminders();
  const deadlines = [];
  state.tasks.forEach(t => { if (t.due && t.status !== 'Completed') deadlines.push({ label: t.name, date: t.due, go: 'tasks' }); });
  state.payments.forEach(p => { const bal = (+p.total || 0) - (+p.paid || 0); if (p.due && bal > 0) deadlines.push({ label: `Pay ${p.vendor} (${fmtMoney(bal)})`, date: p.due, go: 'payments' }); });
  deadlines.sort((a, b) => a.date.localeCompare(b.date));
  const cdHTML = !cd ? '<p class="muted">Set your wedding date in Wedding Details to start the countdown.</p>'
    : cd.passed ? `<div class="count-box"><div class="num">${icon('heart', 26)}</div><div class="lbl">Just married</div></div>`
    : ['d|Days', 'h|Hours', 'm|Minutes', 's|Seconds'].map(k => {
      const [key, lbl] = k.split('|');
      return `<div class="count-box"><div class="num" id="cd-${key}">${cd[key]}</div><div class="lbl">${lbl}</div></div>`;
    }).join('');
  return `
  ${sectionHead('Dashboard', 'Your wedding at a glance.', `
    <button class="btn no-print" data-act="print">${icon('printer', 15)} Print</button>
    <button class="btn btn-primary no-print" data-act="edit-details">${icon('edit', 15)} Edit details</button>`)}
  <div class="hero">
    <h1>${esc(s.bride || 'Bride')} &amp; ${esc(s.groom || 'Groom')}</h1>
    <p class="couple-sub">${esc(s.weddingDate ? fmtDate(s.weddingDate) : 'Date to be decided')}${s.location ? ' · ' + esc(s.location) : ''}${s.venue ? ' · ' + esc(s.venue) : ''}</p>
    <div class="countdown" id="countdown">${cdHTML}</div>
    <div><span class="ny-clock"><span class="pulse"></span> New York · <span id="nyClock">${esc(nyNow())}</span></span></div>
  </div>
  <div class="grid cols-4 mb-4">
    <div class="card stat-card">${icon('checklist', 22)}<div class="stat-num">${prog}%</div><div class="stat-label">Overall planning progress</div><div class="mt-2">${progressBar(prog, true)}</div></div>
    <div class="card stat-card">${icon('wallet', 22)}<div class="stat-num">${fmtMoney(bt.actual)}</div><div class="stat-label">of ${fmtMoney(bt.total)} budget spent</div><div class="mt-2">${progressBar(bt.total ? bt.actual / bt.total * 100 : 0, true)}</div></div>
    <div class="card stat-card">${icon('users', 22)}<div class="stat-num">${gs.attending}<span class="small muted">/${gs.invited}</span></div><div class="stat-label">guests attending</div><div class="mt-2">${progressBar(gs.invited ? gs.attending / gs.invited * 100 : 0, true)}</div></div>
    <div class="card stat-card">${icon('tasks', 22)}<div class="stat-num">${tasksLeft}</div><div class="stat-label">tasks remaining</div><div class="mt-2 small muted">${state.tasks.length - tasksLeft} completed</div></div>
  </div>
  <div class="grid cols-2">
    <div class="card">
      <h3>${icon('alert', 18)} Reminders</h3>
      ${rems.length ? rems.map(r => `
        <div class="reminder-item" data-go="${r.go}" style="cursor:pointer">
          <span class="badge ${r.tone}">${icon(r.ic, 14)}</span>
          <div><strong>${esc(r.title)}</strong><br><small>${esc(r.sub)}</small></div>
        </div>`).join('')
        : `<div class="empty-state">${icon('check', 34)}<h3>All clear</h3><p>No overdue items or upcoming deadlines. Enjoy the calm.</p></div>`}
    </div>
    <div class="card">
      <h3>${icon('calendar', 18)} Upcoming deadlines</h3>
      ${deadlines.length ? deadlines.slice(0, 7).map(d => `
        <div class="reminder-item" data-go="${d.go}" style="cursor:pointer">
          <span class="badge ${d.date < todayISO() ? 'red' : 'gray'}">${fmtDate(d.date)}</span>
          <div><strong>${esc(d.label)}</strong></div>
        </div>`).join('')
        : `<div class="empty-state">${icon('calendar', 34)}<h3>Nothing scheduled</h3><p>Add due dates to tasks and payments to see them here.</p></div>`}
    </div>
  </div>`;
};
RENDER.dashboard.after = function () {
  tickers.push(setInterval(() => {
    const cd = countdownParts();
    if (cd && !cd.passed) { ['d', 'h', 'm', 's'].forEach(k => { const el = $('#cd-' + k); if (el) el.textContent = cd[k]; }); }
    const ny = $('#nyClock'); if (ny) ny.textContent = nyNow();
  }, 1000));
  $$('#view [data-go]').forEach(el => el.onclick = () => showSection(el.dataset.go));
  const pb = $('#view [data-act="print"]'); if (pb) pb.onclick = () => window.print();
  const ed = $('#view [data-act="edit-details"]'); if (ed) ed.onclick = () => showSection('details');
};

/* ---------------- Wedding Details ---------------- */
RENDER.details = function () {
  const s = state.settings;
  const v = (k, ph = '') => esc(s[k] || '');
  return `
  ${sectionHead('Wedding Details', 'The essentials — shown across your whole planner.')}
  <div class="card" style="max-width:760px">
    <form id="detailsForm" novalidate>
      <div class="form-row">
        <div class="field"><label>Bride's name <span class="req">*</span></label><input type="text" name="bride" value="${v('bride')}" required><div class="error-msg">Please enter a name.</div></div>
        <div class="field"><label>Groom's name <span class="req">*</span></label><input type="text" name="groom" value="${v('groom')}" required><div class="error-msg">Please enter a name.</div></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Wedding date <span class="req">*</span></label><input type="date" name="weddingDate" value="${v('weddingDate')}" required><div class="error-msg">Please choose the wedding date.</div></div>
        <div class="field"><label>Wedding style</label><input type="text" name="style" value="${v('style')}" placeholder="e.g. Garden Romance"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Ceremony time</label><input type="time" name="ceremonyTime" value="${v('ceremonyTime')}"></div>
        <div class="field"><label>Reception time</label><input type="time" name="receptionTime" value="${v('receptionTime')}"></div>
      </div>
      <div class="field"><label>Venue</label><input type="text" name="venue" value="${v('venue')}" placeholder="e.g. Rosewood Gardens"></div>
      <div class="field"><label>Location</label><input type="text" name="location" value="${v('location')}" placeholder="City, State"></div>
      <div class="field"><label>Wedding notes</label><textarea name="notes" placeholder="Anything special to remember…">${v('notes')}</textarea></div>
      <div class="actions-row"><button type="submit" class="btn btn-primary">${icon('check', 15)} Save details</button></div>
    </form>
  </div>
  <div class="card mt-4" style="max-width:760px">
    <h3>At a glance</h3>
    <dl class="kv">
      <dt>Countdown</dt><dd>${(() => { const d = daysUntil(s.weddingDate); return d == null ? '—' : d < 0 ? 'Just married!' : d + ' days to go'; })()}</dd>
      <dt>Guests invited</dt><dd>${guestStats().invited}</dd>
      <dt>Total budget</dt><dd>${fmtMoney(state.budget.total)}</dd>
    </dl>
  </div>`;
};
RENDER.details.after = function () {
  $('#detailsForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target; let ok = true;
    ['bride', 'groom', 'weddingDate'].forEach(n => {
      const inp = f[n]; const bad = !inp.value.trim();
      inp.closest('.field').classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { toast('Please fill in the required fields', 'alert'); return; }
    ['bride', 'groom', 'weddingDate', 'ceremonyTime', 'receptionTime', 'venue', 'location', 'style', 'notes']
      .forEach(n => state.settings[n] = f[n].value.trim());
    save(); toast('Wedding details saved'); showSection('details');
  });
};

/* ============================================================
   Checklist · Tasks · Budget
   ============================================================ */
const CHECK_ORDER = ['12+ Months Before', '9–12 Months Before', '6–9 Months Before', '3–6 Months Before', '1–3 Months Before', 'Final Month', 'Wedding Week', 'Wedding Day', 'After Wedding'];

function checklistFormHTML(item = {}, section = '') {
  return `
    <div class="field"><label>Task <span class="req">*</span></label><input type="text" name="text" value="${esc(item.text || '')}" required placeholder="e.g. Book the photographer"></div>
    <div class="form-row">
      <div class="field"><label>Section</label><select name="section">${CHECK_ORDER.map(s => `<option ${s === (item.section || section) ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="field"><label>Deadline</label><input type="date" name="due" value="${esc(item.due || '')}"></div>
    </div>
    <div class="field"><label>Assigned to</label><input type="text" name="assignee" value="${esc(item.assignee || '')}" placeholder="Name"></div>`;
}
RENDER.checklist = function () {
  const q = (sectionQuery.checklist || '').toLowerCase();
  const done = state.checklist.filter(c => c.done).length;
  const secs = CHECK_ORDER.map(sec => {
    const items = state.checklist.filter(c => c.section === sec && (!q || c.text.toLowerCase().includes(q)));
    const all = state.checklist.filter(c => c.section === sec);
    const dpct = all.length ? all.filter(c => c.done).length / all.length * 100 : 0;
    return { sec, items, all, dpct };
  }).filter(s => s.items.length || !q);
  return `
  ${sectionHead('Wedding Checklist', `${done} of ${state.checklist.length} done — organized by when to do it.`, `
    <button class="btn no-print" data-act="print">${icon('printer', 15)} Print</button>
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add task</button>`)}
  <div class="toolbar no-print"><input type="text" id="ckSearch" class="grow" placeholder="Search checklist…" value="${esc(sectionQuery.checklist || '')}"></div>
  <div class="card mb-4"><div class="flex justify-between items-center mb-2"><strong>Overall progress</strong><span>${Math.round(done / Math.max(1, state.checklist.length) * 100)}%</span></div>${progressBar(done / Math.max(1, state.checklist.length) * 100)}</div>
  ${secs.length ? secs.map(({ sec, items, dpct }) => `
    <div class="check-section card mb-4">
      <h3>${esc(sec)} <span class="badge ${dpct === 100 ? 'green' : 'gray'}">${Math.round(dpct)}%</span>
        <span style="flex:1"></span>
        <button class="btn btn-sm no-print" data-addsec="${esc(sec)}">${icon('plus', 13)} Add</button></h3>
      ${progressBar(dpct, true)}
      <div class="mt-2">${items.map(c => `
        <div class="check-item">
          <input type="checkbox" class="check" data-toggle="${c.id}" ${c.done ? 'checked' : ''} aria-label="Mark done">
          <div class="txt ${c.done ? 'done' : ''}"><div>${esc(c.text)}</div>
            <div class="meta">${c.due ? 'Due ' + fmtDate(c.due) + (c.due < todayISO() && !c.done ? ' · <span style="color:var(--error);font-weight:600">overdue</span>' : '') : ''}${c.assignee ? ' · ' + esc(c.assignee) : ''}</div></div>
          <div class="row-actions no-print">
            <button class="icon-btn" style="width:32px;height:32px" data-edit="${c.id}" title="Edit">${icon('edit', 14)}</button>
            <button class="icon-btn" style="width:32px;height:32px" data-del="${c.id}" title="Delete">${icon('trash', 14)}</button>
          </div>
        </div>`).join('') || '<p class="muted small">No tasks here yet.</p>'}
      </div>
    </div>`).join('')
    : emptyState('checklist', 'No matching tasks', 'Try a different search.', '', '')}
  `;
};
RENDER.checklist.after = function () {
  $('#ckSearch').addEventListener('input', debounce(e => { sectionQuery.checklist = e.target.value; showSection('checklist'); const i = $('#ckSearch'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 350));
  $$('#view [data-toggle]').forEach(cb => cb.onchange = () => {
    const c = state.checklist.find(x => x.id === cb.dataset.toggle);
    if (c) { c.done = cb.checked; save(); showSection('checklist'); }
  });
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const c = state.checklist.find(x => x.id === b.dataset.edit);
    openModal('Edit task', checklistFormHTML(c), { onSubmit: d => {
      if (!d.text.trim()) return 'Please enter the task.';
      Object.assign(c, { text: d.text.trim(), section: d.section, due: d.due, assignee: d.assignee.trim() });
      save(); showSection('checklist'); toast('Task updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const c = state.checklist.find(x => x.id === b.dataset.del);
    confirmAction(`Delete "${c.text}"?`, () => { state.checklist = state.checklist.filter(x => x.id !== c.id); save(); showSection('checklist'); });
  });
  const addFor = sec => openModal('Add checklist task', checklistFormHTML({}, sec), { onSubmit: d => {
    if (!d.text.trim()) return 'Please enter the task.';
    state.checklist.push({ id: uid(), section: d.section, text: d.text.trim(), done: false, due: d.due, assignee: d.assignee.trim() });
    save(); showSection('checklist'); toast('Task added'); return null;
  }});
  $$('#view [data-addsec]').forEach(b => b.onclick = () => addFor(b.dataset.addsec));
  $('[data-act="add"]').onclick = () => addFor(CHECK_ORDER[0]);
  $('[data-act="print"]').onclick = () => window.print();
};

/* ---------------- Tasks ---------------- */
let taskFilter = { tab: 'all', pri: 'all' };
function taskFormHTML(t = {}) {
  const cats = ['Vendors', 'Venue', 'Guests', 'Budget', 'Attire', 'Flowers', 'Music', 'Invitations', 'Honeymoon', 'Legal', 'Other'];
  return `
    <div class="field"><label>Task name <span class="req">*</span></label><input type="text" name="name" value="${esc(t.name || '')}" required></div>
    <div class="form-row">
      <div class="field"><label>Category</label><select name="category">${cats.map(c => `<option ${t.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
      <div class="field"><label>Due date</label><input type="date" name="due" value="${esc(t.due || '')}"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Priority</label><select name="priority">${['Low', 'Medium', 'High'].map(p => `<option ${t.priority === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
      <div class="field"><label>Status</label><select name="status">${['Not Started', 'In Progress', 'Completed'].map(s => `<option ${t.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>Assigned to</label><input type="text" name="assignee" value="${esc(t.assignee || '')}"></div>
    <div class="field"><label>Notes</label><textarea name="notes">${esc(t.notes || '')}</textarea></div>`;
}
RENDER.tasks = function () {
  const q = (sectionQuery.tasks || '').toLowerCase();
  const t = todayISO();
  let list = state.tasks.slice();
  if (taskFilter.tab === 'upcoming') list = list.filter(x => x.status !== 'Completed' && x.due && x.due >= t);
  if (taskFilter.tab === 'overdue') list = list.filter(x => x.status !== 'Completed' && x.due && x.due < t);
  if (taskFilter.tab === 'completed') list = list.filter(x => x.status === 'Completed');
  if (taskFilter.pri !== 'all') list = list.filter(x => x.priority === taskFilter.pri);
  if (q) list = list.filter(x => (x.name + ' ' + (x.category || '')).toLowerCase().includes(q));
  list.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
  const donePct = state.tasks.length ? state.tasks.filter(x => x.status === 'Completed').length / state.tasks.length * 100 : 0;
  const tabs = [['all', 'All'], ['upcoming', 'Upcoming'], ['overdue', 'Overdue'], ['completed', 'Completed']];
  return `
  ${sectionHead('Tasks', 'Everything to do, in one place.', `
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add task</button>`)}
  <div class="card mb-4"><div class="flex justify-between items-center mb-2"><strong>${state.tasks.filter(x => x.status === 'Completed').length} of ${state.tasks.length} completed</strong><span>${Math.round(donePct)}%</span></div>${progressBar(donePct)}</div>
  <div class="toolbar no-print">
    <div class="tabs" style="margin:0">${tabs.map(([id, l]) => `<button class="tab ${taskFilter.tab === id ? 'active' : ''}" data-tab="${id}">${l}</button>`).join('')}</div>
    <select id="priFilter" aria-label="Filter by priority">
      <option value="all">All priorities</option>${['Low', 'Medium', 'High'].map(p => `<option ${taskFilter.pri === p ? 'selected' : ''}>${p}</option>`).join('')}
    </select>
    <input type="text" id="taskSearch" class="grow" placeholder="Search tasks…" value="${esc(sectionQuery.tasks || '')}">
  </div>
  ${list.length ? `<div class="table-wrap"><table class="data"><thead><tr><th></th><th>Task</th><th>Category</th><th>Due</th><th>Priority</th><th>Status</th><th>Assignee</th><th class="no-print"></th></tr></thead><tbody>
    ${list.map(x => `<tr>
      <td><input type="checkbox" class="check" data-done="${x.id}" ${x.status === 'Completed' ? 'checked' : ''} aria-label="Toggle complete"></td>
      <td><strong>${esc(x.name)}</strong>${x.notes ? `<br><small class="muted">${esc(x.notes.slice(0, 80))}</small>` : ''}</td>
      <td>${esc(x.category || '—')}</td>
      <td>${x.due ? fmtDate(x.due) + (x.due < t && x.status !== 'Completed' ? ' ' + badge('Overdue', 'red') : '') : '—'}</td>
      <td>${badge(x.priority || 'Medium', priTone(x.priority))}</td>
      <td>${badge(x.status, statusTone(x.status))}</td>
      <td>${esc(x.assignee || '—')}</td>
      <td class="no-print" style="white-space:nowrap">
        <button class="icon-btn" style="width:32px;height:32px" data-edit="${x.id}" title="Edit">${icon('edit', 14)}</button>
        <button class="icon-btn" style="width:32px;height:32px" data-del="${x.id}" title="Delete">${icon('trash', 14)}</button>
      </td></tr>`).join('')}
  </tbody></table></div>`
  : emptyState('tasks', 'No tasks here', 'Add your first task to get organized.', 'Add task', 'add-task')}`;
};
RENDER.tasks.after = function () {
  $$('#view [data-tab]').forEach(b => b.onclick = () => { taskFilter.tab = b.dataset.tab; showSection('tasks'); });
  $('#priFilter').onchange = e => { taskFilter.pri = e.target.value; showSection('tasks'); };
  $('#taskSearch').addEventListener('input', debounce(e => { sectionQuery.tasks = e.target.value; showSection('tasks'); const i = $('#taskSearch'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 350));
  $$('#view [data-done]').forEach(cb => cb.onchange = () => {
    const x = state.tasks.find(t => t.id === cb.dataset.done);
    if (x) { x.status = cb.checked ? 'Completed' : 'Not Started'; save(); showSection('tasks'); toast(cb.checked ? 'Task completed — nice!' : 'Task reopened'); }
  });
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const x = state.tasks.find(t => t.id === b.dataset.edit);
    openModal('Edit task', taskFormHTML(x), { onSubmit: d => {
      if (!d.name.trim()) return 'Please enter a task name.';
      Object.assign(x, { name: d.name.trim(), category: d.category, due: d.due, priority: d.priority, status: d.status, assignee: d.assignee.trim(), notes: d.notes.trim() });
      save(); showSection('tasks'); toast('Task updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const x = state.tasks.find(t => t.id === b.dataset.del);
    confirmAction(`Delete task "${x.name}"?`, () => { state.tasks = state.tasks.filter(t => t.id !== x.id); save(); showSection('tasks'); });
  });
  const add = () => openModal('Add task', taskFormHTML(), { onSubmit: d => {
    if (!d.name.trim()) return 'Please enter a task name.';
    state.tasks.push({ id: uid(), name: d.name.trim(), category: d.category, due: d.due, priority: d.priority, status: d.status, assignee: d.assignee.trim(), notes: d.notes.trim() });
    save(); showSection('tasks'); toast('Task added'); return null;
  }});
  $('[data-act="add"]').onclick = add;
  const eb = $('[data-act="add-task"]'); if (eb) eb.onclick = add;
};

/* ---------------- Budget ---------------- */
RENDER.budget = function () {
  const bt = budgetTotals();
  const pct = bt.total ? bt.actual / bt.total * 100 : 0;
  return `
  ${sectionHead('Budget Planner', 'Plan it, track it, stay on target.', `
    <button class="btn no-print" data-act="print">${icon('printer', 15)} Print</button>
    <button class="btn" data-act="edit-total">${icon('edit', 15)} Total budget</button>
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add category</button>`)}
  <div class="grid cols-4 mb-4">
    <div class="card stat-card">${icon('wallet', 22)}<div class="stat-num">${fmtMoney(bt.total)}</div><div class="stat-label">Total budget</div></div>
    <div class="card stat-card">${icon('card', 22)}<div class="stat-num">${fmtMoney(bt.actual)}</div><div class="stat-label">Actual spending</div></div>
    <div class="card stat-card">${icon('check', 22)}<div class="stat-num" style="color:${bt.remaining < 0 ? 'var(--error)' : 'var(--success)'}">${fmtMoney(bt.remaining)}</div><div class="stat-label">Remaining</div></div>
    <div class="card stat-card">${icon('star', 22)}<div class="stat-num">${fmtMoney(bt.estimated)}</div><div class="stat-label">Estimated total</div></div>
  </div>
  <div class="card mb-4"><div class="flex justify-between items-center mb-2"><strong>Budget utilization</strong><span>${Math.round(pct)}%</span></div>${progressBar(pct)}</div>
  <div class="table-wrap"><table class="data"><thead><tr><th>Category</th><th>Estimated</th><th>Actual</th><th>Remaining</th><th style="min-width:140px">Progress</th><th class="no-print"></th></tr></thead><tbody>
  ${state.budget.categories.map(c => {
    const est = +c.estimated || 0, act = +c.actual || 0;
    const p = est ? act / est * 100 : (act ? 100 : 0);
    return `<tr><td><strong>${esc(c.name)}</strong></td><td>${fmtMoney(est)}</td><td>${fmtMoney(act)}</td>
      <td style="color:${est - act < 0 ? 'var(--error)' : 'inherit'}">${fmtMoney(est - act)}</td>
      <td>${progressBar(p, true)}</td>
      <td class="no-print" style="white-space:nowrap">
        <button class="icon-btn" style="width:32px;height:32px" data-edit="${c.id}" title="Edit">${icon('edit', 14)}</button>
        <button class="icon-btn" style="width:32px;height:32px" data-del="${c.id}" title="Delete">${icon('trash', 14)}</button>
      </td></tr>`;
  }).join('')}
  </tbody></table></div>`;
};
function budgetCatForm(c = {}) {
  return `
    <div class="field"><label>Category name <span class="req">*</span></label><input type="text" name="name" value="${esc(c.name || '')}" required></div>
    <div class="form-row">
      <div class="field"><label>Estimated ($)</label><input type="number" name="estimated" min="0" step="1" value="${esc(c.estimated ?? '')}"></div>
      <div class="field"><label>Actual spent ($)</label><input type="number" name="actual" min="0" step="1" value="${esc(c.actual ?? '')}"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Deposit paid ($)</label><input type="number" name="deposit" min="0" step="1" value="${esc(c.deposit ?? '')}"></div>
      <div class="field"><label>Payment due date</label><input type="date" name="due" value="${esc(c.due || '')}"></div>
    </div>`;
}
RENDER.budget.after = function () {
  const num = v => v === '' ? 0 : Math.max(0, Number(v) || 0);
  $('[data-act="edit-total"]').onclick = () => openModal('Total wedding budget', `
    <div class="field"><label>Total budget ($) <span class="req">*</span></label><input type="number" name="total" min="0" step="100" value="${esc(state.budget.total)}" required></div>`,
    { onSubmit: d => { state.budget.total = num(d.total); save(); showSection('budget'); toast('Budget updated'); return null; } });
  $('[data-act="add"]').onclick = () => openModal('Add budget category', budgetCatForm(), { onSubmit: d => {
    if (!d.name.trim()) return 'Please enter a category name.';
    state.budget.categories.push({ id: uid(), name: d.name.trim(), estimated: num(d.estimated), actual: num(d.actual), deposit: num(d.deposit), due: d.due });
    save(); showSection('budget'); toast('Category added'); return null;
  }});
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const c = state.budget.categories.find(x => x.id === b.dataset.edit);
    openModal('Edit ' + c.name, budgetCatForm(c), { onSubmit: d => {
      if (!d.name.trim()) return 'Please enter a category name.';
      Object.assign(c, { name: d.name.trim(), estimated: num(d.estimated), actual: num(d.actual), deposit: num(d.deposit), due: d.due });
      save(); showSection('budget'); toast('Category updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const c = state.budget.categories.find(x => x.id === b.dataset.del);
    confirmAction(`Delete category "${c.name}"?`, () => { state.budget.categories = state.budget.categories.filter(x => x.id !== c.id); save(); showSection('budget'); });
  });
  $('[data-act="print"]').onclick = () => window.print();
};

/* ============================================================
   Guests · Seating · Invitations
   ============================================================ */
let guestFilter = { rsvp: 'all', group: 'all', sort: 'name' };
const RSVPS = ['Pending', 'Attending', 'Not Attending', 'Maybe'];
const MEALS = ['Standard', 'Vegetarian', 'Vegan', 'Gluten-free', 'Kosher', 'Halal', 'Kids'];
function guestFormHTML(g = {}) {
  const groups = [...new Set(state.guests.map(x => x.group).filter(Boolean))];
  return `
    <div class="form-row">
      <div class="field"><label>Full name <span class="req">*</span></label><input type="text" name="name" value="${esc(g.name || '')}" required></div>
      <div class="field"><label>Family / group</label><input type="text" name="group" list="grouplist" value="${esc(g.group || '')}" placeholder="e.g. Bride's Family"><datalist id="grouplist">${groups.map(x => `<option value="${esc(x)}">`).join('')}</datalist></div>
    </div>
    <div class="form-row">
      <div class="field"><label>RSVP status</label><select name="rsvp">${RSVPS.map(r => `<option ${g.rsvp === r ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
      <div class="field"><label>Party size</label><input type="number" name="partySize" min="1" max="20" value="${esc(g.partySize ?? 1)}"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Email</label><input type="email" name="email" value="${esc(g.email || '')}"></div>
      <div class="field"><label>Phone</label><input type="tel" name="phone" value="${esc(g.phone || '')}"></div>
    </div>
    <div class="field"><label>Address</label><input type="text" name="address" value="${esc(g.address || '')}"></div>
    <div class="form-row">
      <div class="field"><label>Meal preference</label><select name="meal">${MEALS.map(m => `<option ${g.meal === m ? 'selected' : ''}>${m}</option>`).join('')}</select></div>
      <div class="field"><label>Table</label><select name="table"><option value="">— Unassigned —</option>${state.tables.map(t => `<option value="${t.id}" ${g.table === t.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></div>
    </div>
    <div class="field"><label>Dietary restrictions</label><input type="text" name="dietary" value="${esc(g.dietary || '')}"></div>
    <div class="form-row">
      <div class="field"><label style="display:flex;align-items:center;gap:8px"><input type="checkbox" class="check" name="inviteSent" data-bool ${g.inviteSent ? 'checked' : ''}> Invitation sent</label></div>
      <div class="field"><label style="display:flex;align-items:center;gap:8px"><input type="checkbox" class="check" name="gift" data-bool ${g.gift ? 'checked' : ''}> Gift received / noted</label></div>
    </div>
    <div class="field"><label>Notes</label><textarea name="notes">${esc(g.notes || '')}</textarea></div>`;
}
RENDER.guests = function () {
  const q = (sectionQuery.guests || '').toLowerCase();
  const gs = guestStats();
  const groups = [...new Set(state.guests.map(g => g.group).filter(Boolean))];
  let list = state.guests.slice();
  if (guestFilter.rsvp !== 'all') list = list.filter(g => g.rsvp === guestFilter.rsvp);
  if (guestFilter.group !== 'all') list = list.filter(g => g.group === guestFilter.group);
  if (q) list = list.filter(g => (g.name + ' ' + (g.email || '') + ' ' + (g.group || '')).toLowerCase().includes(q));
  list.sort((a, b) => guestFilter.sort === 'group' ? (a.group || '').localeCompare(b.group || '') || a.name.localeCompare(b.name)
    : guestFilter.sort === 'rsvp' ? a.rsvp.localeCompare(b.rsvp) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  return `
  ${sectionHead('Guest List', `${gs.count} parties · ${gs.invited} invited · ${gs.attending} attending.`, `
    <button class="btn no-print" data-act="print">${icon('printer', 15)} Print</button>
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add guest</button>`)}
  <div class="grid cols-4 mb-4">
    <div class="card stat-card"><div class="stat-num">${gs.invited}</div><div class="stat-label">Invited</div></div>
    <div class="card stat-card"><div class="stat-num" style="color:var(--success)">${gs.attending}</div><div class="stat-label">Attending</div></div>
    <div class="card stat-card"><div class="stat-num" style="color:var(--warning)">${gs.pending}</div><div class="stat-label">Pending</div></div>
    <div class="card stat-card"><div class="stat-num" style="color:var(--error)">${gs.declined}</div><div class="stat-label">Declined</div></div>
  </div>
  <div class="toolbar no-print">
    <input type="text" id="guestSearch" class="grow" placeholder="Search name, email, group…" value="${esc(sectionQuery.guests || '')}">
    <select id="rsvpFilter" aria-label="Filter by RSVP"><option value="all">All RSVPs</option>${RSVPS.map(r => `<option ${guestFilter.rsvp === r ? 'selected' : ''}>${r}</option>`).join('')}</select>
    <select id="groupFilter" aria-label="Filter by group"><option value="all">All groups</option>${groups.map(g => `<option ${guestFilter.group === g ? 'selected' : ''}>${esc(g)}</option>`).join('')}</select>
    <select id="sortSel" aria-label="Sort"><option value="name">Sort: Name</option><option value="group" ${guestFilter.sort === 'group' ? 'selected' : ''}>Sort: Group</option><option value="rsvp" ${guestFilter.sort === 'rsvp' ? 'selected' : ''}>Sort: RSVP</option></select>
  </div>
  ${list.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Name</th><th>Group</th><th>RSVP</th><th>Party</th><th>Meal</th><th>Table</th><th>Invite</th><th class="no-print"></th></tr></thead><tbody>
    ${list.map(g => `<tr>
      <td><strong>${esc(g.name)}</strong>${g.dietary ? `<br><small class="muted">Dietary: ${esc(g.dietary)}</small>` : ''}</td>
      <td>${esc(g.group || '—')}</td><td>${badge(g.rsvp, rsvpTone(g.rsvp))}</td><td>${g.partySize || 1}</td>
      <td>${esc(g.meal || '—')}</td><td>${esc(tableName(g.table))}</td>
      <td>${g.inviteSent ? badge('Sent', 'blue') : badge('Not sent', 'gray')}</td>
      <td class="no-print" style="white-space:nowrap">
        <button class="icon-btn" style="width:32px;height:32px" data-edit="${g.id}" title="Edit">${icon('edit', 14)}</button>
        <button class="icon-btn" style="width:32px;height:32px" data-del="${g.id}" title="Delete">${icon('trash', 14)}</button>
      </td></tr>`).join('')}
  </tbody></table></div>`
  : emptyState('users', 'No guests found', 'Add your first guest to start building the list.', 'Add guest', 'add-guest')}`;
};
function wireGuestCRUD(afterEdit) {
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const g = state.guests.find(x => x.id === b.dataset.edit);
    openModal('Edit guest', guestFormHTML(g), { onSubmit: d => {
      if (!d.name.trim()) return 'Please enter the guest name.';
      Object.assign(g, { name: d.name.trim(), group: d.group.trim(), rsvp: d.rsvp, partySize: Math.max(1, +d.partySize || 1), email: d.email.trim(), phone: d.phone.trim(), address: d.address.trim(), meal: d.meal, table: d.table, dietary: d.dietary.trim(), inviteSent: !!d.inviteSent, gift: !!d.gift, notes: d.notes.trim() });
      save(); showSection(currentSection); toast('Guest updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const g = state.guests.find(x => x.id === b.dataset.del);
    confirmAction(`Remove ${g.name} from the guest list?`, () => { state.guests = state.guests.filter(x => x.id !== g.id); save(); showSection(currentSection); });
  });
  const add = () => openModal('Add guest', guestFormHTML(), { onSubmit: d => {
    if (!d.name.trim()) return 'Please enter the guest name.';
    state.guests.push({ id: uid(), name: d.name.trim(), group: d.group.trim(), rsvp: d.rsvp, partySize: Math.max(1, +d.partySize || 1), email: d.email.trim(), phone: d.phone.trim(), address: d.address.trim(), meal: d.meal, table: d.table, dietary: d.dietary.trim(), inviteSent: !!d.inviteSent, gift: !!d.gift, notes: d.notes.trim(), rsvpDate: '' });
    save(); showSection(currentSection); toast('Guest added'); return null;
  }});
  const ab = $('[data-act="add"]'); if (ab) ab.onclick = add;
  const eb = $('[data-act="add-guest"]'); if (eb) eb.onclick = add;
}
RENDER.guests.after = function () {
  $('#guestSearch').addEventListener('input', debounce(e => { sectionQuery.guests = e.target.value; showSection('guests'); const i = $('#guestSearch'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 350));
  $('#rsvpFilter').onchange = e => { guestFilter.rsvp = e.target.value; showSection('guests'); };
  $('#groupFilter').onchange = e => { guestFilter.group = e.target.value; showSection('guests'); };
  $('#sortSel').onchange = e => { guestFilter.sort = e.target.value; showSection('guests'); };
  wireGuestCRUD();
  $('[data-act="print"]').onclick = () => window.print();
};

/* ---------------- Seating ---------------- */
const TABLE_TYPES = ['round', 'rect', 'head', 'sweetheart'];
const TABLE_LABELS = { round: 'Round', rect: 'Rectangular', head: 'Head table', sweetheart: 'Sweetheart' };
RENDER.seating = function () {
  const assigned = new Set(state.guests.filter(g => g.table).map(g => g.table));
  const unassigned = state.guests.filter(g => !g.table);
  return `
  ${sectionHead('Seating Plan', 'Arrange your guests table by table.', `
    <button class="btn no-print" data-act="print">${icon('printer', 15)} Print</button>
    <button class="btn btn-primary" data-act="add-table">${icon('plus', 15)} Add table</button>`)}
  <div class="card mb-4"><strong>${state.guests.length - unassigned.length}</strong> of <strong>${state.guests.length}</strong> guests seated ${progressBar(state.guests.length ? (state.guests.length - unassigned.length) / state.guests.length * 100 : 0, true)}</div>
  ${state.tables.length ? `<div class="tables-grid mb-4">
    ${state.tables.map(t => {
      const seated = state.guests.filter(g => g.table === t.id);
      const full = seated.length >= t.seats;
      return `<div class="table-card">
        <div class="table-top">
          <strong>${esc(t.name)}</strong>
          <span class="no-print" style="display:flex;gap:4px">
            <button class="icon-btn" style="width:30px;height:30px" data-tedit="${t.id}" title="Edit table">${icon('edit', 13)}</button>
            <button class="icon-btn" style="width:30px;height:30px" data-tdel="${t.id}" title="Delete table">${icon('trash', 13)}</button>
          </span>
        </div>
        <div class="table-shape ${t.type}">${seated.length}/${t.seats}</div>
        <div class="seat-count">${TABLE_LABELS[t.type]} · ${full ? '<span style="color:var(--error);font-weight:600">Full</span>' : (t.seats - seated.length) + ' seats left'}</div>
        <div>${seated.map(g => `<span class="guest-chip">${esc(g.name)}<button data-unseat="${g.id}" title="Remove" class="no-print">${icon('x', 12)}</button></span>`).join('') || '<small class="muted">No guests yet</small>'}</div>
      </div>`;
    }).join('')}
  </div>` : emptyState('grid', 'No tables yet', 'Create your first table to start seating guests.', '', '')}
  <div class="card">
    <h3>${icon('users', 18)} Unassigned guests ${unassigned.length ? badge(unassigned.length + ' waiting', 'amber') : badge('All seated', 'green')}</h3>
    ${unassigned.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Guest</th><th>Group</th><th class="no-print">Assign to table</th></tr></thead><tbody>
      ${unassigned.map(g => `<tr><td><strong>${esc(g.name)}</strong> <small class="muted">(${g.partySize || 1})</small></td><td>${esc(g.group || '—')}</td>
      <td class="no-print"><div class="flex gap-2"><select id="asg-${g.id}" style="width:auto">${state.tables.map(t => { const n = state.guests.filter(x => x.table === t.id).length; return `<option value="${t.id}" ${n >= t.seats ? 'disabled' : ''}>${esc(t.name)}${n >= t.seats ? ' (full)' : ''}</option>`; }).join('')}</select>
      <button class="btn btn-sm btn-primary" data-assign="${g.id}">Seat</button></div></td></tr>`).join('')}
    </tbody></table></div>` : '<p class="muted">Everyone has a seat.</p>'}
  </div>`;
};
RENDER.seating.after = function () {
  const tableForm = (t = {}) => `
    <div class="field"><label>Table name <span class="req">*</span></label><input type="text" name="name" value="${esc(t.name || '')}" required></div>
    <div class="form-row">
      <div class="field"><label>Type</label><select name="type">${TABLE_TYPES.map(x => `<option value="${x}" ${t.type === x ? 'selected' : ''}>${TABLE_LABELS[x]}</option>`).join('')}</select></div>
      <div class="field"><label>Seats</label><input type="number" name="seats" min="1" max="40" value="${esc(t.seats ?? 8)}"></div>
    </div>`;
  $('[data-act="add-table"]').onclick = () => openModal('Add table', tableForm(), { onSubmit: d => {
    if (!d.name.trim()) return 'Please enter a table name.';
    state.tables.push({ id: uid(), name: d.name.trim(), type: d.type, seats: Math.max(1, +d.seats || 8) });
    save(); showSection('seating'); toast('Table added'); return null;
  }});
  $$('#view [data-tedit]').forEach(b => b.onclick = () => {
    const t = state.tables.find(x => x.id === b.dataset.tedit);
    openModal('Edit table', tableForm(t), { onSubmit: d => {
      if (!d.name.trim()) return 'Please enter a table name.';
      Object.assign(t, { name: d.name.trim(), type: d.type, seats: Math.max(1, +d.seats || 8) });
      save(); showSection('seating'); toast('Table updated'); return null;
    }});
  });
  $$('#view [data-tdel]').forEach(b => b.onclick = () => {
    const t = state.tables.find(x => x.id === b.dataset.tdel);
    confirmAction(`Delete "${t.name}"? Seated guests will become unassigned.`, () => {
      state.guests.forEach(g => { if (g.table === t.id) g.table = ''; });
      state.tables = state.tables.filter(x => x.id !== t.id);
      save(); showSection('seating');
    });
  });
  $$('#view [data-unseat]').forEach(b => b.onclick = () => {
    const g = state.guests.find(x => x.id === b.dataset.unseat);
    g.table = ''; save(); showSection('seating'); toast(g.name + ' unseated');
  });
  $$('#view [data-assign]').forEach(b => b.onclick = () => {
    const g = state.guests.find(x => x.id === b.dataset.assign);
    const sel = $('#asg-' + g.id);
    g.table = sel.value; save(); showSection('seating'); toast(g.name + ' seated at ' + tableName(g.table));
  });
  $('[data-act="print"]').onclick = () => window.print();
};

/* ---------------- Invitations (view over guests) ---------------- */
RENDER.invitations = function () {
  const sent = state.guests.filter(g => g.inviteSent).length;
  const rsvpd = state.guests.filter(g => g.rsvp !== 'Pending').length;
  const n = state.guests.length;
  return `
  ${sectionHead('Invitation Tracker', 'From mailbox to RSVP.', `
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add guest</button>`)}
  <div class="grid cols-3 mb-4">
    <div class="card stat-card"><div class="stat-num">${n ? Math.round(sent / n * 100) : 0}%</div><div class="stat-label">invitations sent</div><div class="mt-2">${progressBar(n ? sent / n * 100 : 0, true)}</div></div>
    <div class="card stat-card"><div class="stat-num">${n ? Math.round(rsvpd / n * 100) : 0}%</div><div class="stat-label">RSVPs received</div><div class="mt-2">${progressBar(n ? rsvpd / n * 100 : 0, true)}</div></div>
    <div class="card stat-card"><div class="stat-num">${guestStats().attending}</div><div class="stat-label">attending headcount</div></div>
  </div>
  ${n ? `<div class="table-wrap"><table class="data"><thead><tr><th>Guest</th><th>Sent</th><th>RSVP</th><th>RSVP date</th><th>Meal</th><th>Plus-one / party</th><th class="no-print"></th></tr></thead><tbody>
    ${state.guests.map(g => `<tr>
      <td><strong>${esc(g.name)}</strong></td>
      <td><input type="checkbox" class="check" data-sent="${g.id}" ${g.inviteSent ? 'checked' : ''} aria-label="Invitation sent"></td>
      <td><select data-rsvp="${g.id}" style="width:auto;padding:6px 10px">${RSVPS.map(r => `<option ${g.rsvp === r ? 'selected' : ''}>${r}</option>`).join('')}</select></td>
      <td><input type="date" data-rdate="${g.id}" value="${esc(g.rsvpDate || '')}" style="width:auto;padding:6px 10px"></td>
      <td>${esc(g.meal || '—')}</td>
      <td>${g.partySize || 1}</td>
      <td class="no-print"><button class="icon-btn" style="width:32px;height:32px" data-edit="${g.id}" title="Edit guest">${icon('edit', 14)}</button></td>
    </tr>`).join('')}
  </tbody></table></div>`
  : emptyState('mail', 'No guests yet', 'Add guests to track invitations.', 'Add guest', 'add-guest')}`;
};
RENDER.invitations.after = function () {
  $$('#view [data-sent]').forEach(cb => cb.onchange = () => {
    const g = state.guests.find(x => x.id === cb.dataset.sent);
    g.inviteSent = cb.checked; save(); showSection('invitations');
  });
  $$('#view [data-rsvp]').forEach(sel => sel.onchange = () => {
    const g = state.guests.find(x => x.id === sel.dataset.rsvp);
    g.rsvp = sel.value; if (!g.rsvpDate && sel.value !== 'Pending') g.rsvpDate = todayISO();
    save(); showSection('invitations'); toast('RSVP updated');
  });
  $$('#view [data-rdate]').forEach(inp => inp.onchange = () => {
    const g = state.guests.find(x => x.id === inp.dataset.rdate);
    g.rsvpDate = inp.value; save(); toast('RSVP date saved');
  });
  wireGuestCRUD();
};

/* ============================================================
   Vendors · Payments · Timeline (+ Emergency Kit)
   ============================================================ */
const VENDOR_TYPES = ['Venue', 'Photographer', 'Videographer', 'Caterer', 'Florist', 'DJ', 'Band', 'Cake', 'Makeup Artist', 'Hair Stylist', 'Transportation', 'Decor', 'Planner', 'Rentals'];
let vendorTypeFilter = 'all';
function vendorFormHTML(v = {}) {
  return `
    <div class="form-row">
      <div class="field"><label>Vendor type <span class="req">*</span></label><select name="type">${VENDOR_TYPES.map(t => `<option ${v.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
      <div class="field"><label>Contact name</label><input type="text" name="name" value="${esc(v.name || '')}"></div>
    </div>
    <div class="field"><label>Company <span class="req">*</span></label><input type="text" name="company" value="${esc(v.company || '')}" required></div>
    <div class="form-row">
      <div class="field"><label>Phone</label><input type="tel" name="phone" value="${esc(v.phone || '')}"></div>
      <div class="field"><label>Email</label><input type="email" name="email" value="${esc(v.email || '')}"></div>
    </div>
    <div class="field"><label>Website</label><input type="url" name="website" value="${esc(v.website || '')}" placeholder="https://"></div>
    <div class="form-row">
      <div class="field"><label>Total price ($)</label><input type="number" name="price" min="0" step="1" value="${esc(v.price ?? '')}"></div>
      <div class="field"><label>Deposit ($)</label><input type="number" name="deposit" min="0" step="1" value="${esc(v.deposit ?? '')}"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Amount paid ($)</label><input type="number" name="paid" min="0" step="1" value="${esc(v.paid ?? '')}"></div>
      <div class="field"><label>Payment deadline</label><input type="date" name="due" value="${esc(v.due || '')}"></div>
    </div>
    <div class="field"><label>Contract status</label><select name="contract">${['Inquiry', 'Sent', 'Draft', 'Signed', 'Cancelled'].map(c => `<option ${v.contract === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
    <div class="field"><label>Notes</label><textarea name="notes">${esc(v.notes || '')}</textarea></div>`;
}
RENDER.vendors = function () {
  const q = (sectionQuery.vendors || '').toLowerCase();
  let list = state.vendors.slice();
  if (vendorTypeFilter !== 'all') list = list.filter(v => v.type === vendorTypeFilter);
  if (q) list = list.filter(v => (v.company + ' ' + v.name + ' ' + v.type).toLowerCase().includes(q));
  const signed = state.vendors.filter(v => v.contract === 'Signed').length;
  return `
  ${sectionHead('Vendor Manager', `${state.vendors.length} vendors · ${signed} contracts signed.`, `
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add vendor</button>`)}
  <div class="toolbar no-print">
    <input type="text" id="vendorSearch" class="grow" placeholder="Search company, contact, type…" value="${esc(sectionQuery.vendors || '')}">
    <select id="vtypeFilter" aria-label="Filter by type"><option value="all">All types</option>${VENDOR_TYPES.map(t => `<option ${vendorTypeFilter === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
  </div>
  ${list.length ? `<div class="grid cols-3">
    ${list.map(v => {
      const bal = (+v.price || 0) - (+v.paid || 0);
      return `<div class="card hoverable">
        <div class="flex justify-between items-center mb-2"><span class="badge rose">${esc(v.type)}</span>${badge(v.contract || 'Inquiry', statusTone(v.contract))}</div>
        <h3 style="margin-bottom:2px">${esc(v.company)}</h3>
        <p class="muted small mb-2">${esc(v.name || 'No contact name')}</p>
        <dl class="kv small mb-2">
          ${v.phone ? `<dt>Phone</dt><dd>${esc(v.phone)}</dd>` : ''}
          ${v.email ? `<dt>Email</dt><dd>${esc(v.email)}</dd>` : ''}
          ${v.website ? `<dt>Web</dt><dd><a href="${esc(v.website)}" target="_blank" rel="noopener">Visit</a></dd>` : ''}
          <dt>Price</dt><dd>${fmtMoney(v.price)}${bal > 0 ? ` <span class="muted">(${fmtMoney(bal)} due)</span>` : ''}</dd>
          ${v.due ? `<dt>Deadline</dt><dd>${fmtDate(v.due)}</dd>` : ''}
        </dl>
        <div class="actions-row no-print">
          <button class="btn btn-sm" data-edit="${v.id}">${icon('edit', 13)} Edit</button>
          <button class="btn btn-sm" data-pay="${v.id}">${icon('card', 13)} Log payment</button>
          <button class="icon-btn" style="width:32px;height:32px" data-del="${v.id}" title="Delete">${icon('trash', 14)}</button>
        </div>
      </div>`; }).join('')}
  </div>`
  : emptyState('store', 'No vendors found', 'Add your first vendor to start building your team.', 'Add vendor', 'add-vendor')}`;
};
RENDER.vendors.after = function () {
  $('#vendorSearch').addEventListener('input', debounce(e => { sectionQuery.vendors = e.target.value; showSection('vendors'); const i = $('#vendorSearch'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 350));
  $('#vtypeFilter').onchange = e => { vendorTypeFilter = e.target.value; showSection('vendors'); };
  const num = v => v === '' ? 0 : Math.max(0, Number(v) || 0);
  const add = () => openModal('Add vendor', vendorFormHTML(), { onSubmit: d => {
    if (!d.company.trim()) return 'Please enter the company name.';
    const v = { id: uid(), type: d.type, name: d.name.trim(), company: d.company.trim(), phone: d.phone.trim(), email: d.email.trim(), website: d.website.trim(), price: num(d.price), deposit: num(d.deposit), paid: num(d.paid), due: d.due, contract: d.contract, notes: d.notes.trim() };
    state.vendors.push(v);
    state.payments.push({ id: uid(), vendor: v.company, total: v.price, deposit: v.deposit, paid: v.paid, due: v.due, status: v.paid >= v.price && v.price ? 'Paid' : (v.paid > 0 ? 'Partial' : 'Unpaid') });
    save(); showSection('vendors'); toast('Vendor added'); return null;
  }});
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const v = state.vendors.find(x => x.id === b.dataset.edit);
    openModal('Edit vendor', vendorFormHTML(v), { onSubmit: d => {
      if (!d.company.trim()) return 'Please enter the company name.';
      Object.assign(v, { type: d.type, name: d.name.trim(), company: d.company.trim(), phone: d.phone.trim(), email: d.email.trim(), website: d.website.trim(), price: num(d.price), deposit: num(d.deposit), paid: num(d.paid), due: d.due, contract: d.contract, notes: d.notes.trim() });
      save(); showSection('vendors'); toast('Vendor updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const v = state.vendors.find(x => x.id === b.dataset.del);
    confirmAction(`Delete vendor "${v.company}"?`, () => { state.vendors = state.vendors.filter(x => x.id !== v.id); save(); showSection('vendors'); });
  });
  $$('#view [data-pay]').forEach(b => b.onclick = () => {
    const v = state.vendors.find(x => x.id === b.dataset.pay);
    const bal = (+v.price || 0) - (+v.paid || 0);
    openModal('Log payment — ' + v.company, `
      <div class="field"><label>Amount paid now ($) <span class="req">*</span></label><input type="number" name="amt" min="0" step="1" value="${bal > 0 ? bal : ''}" required><div class="hint">Remaining balance: ${fmtMoney(Math.max(0, bal))}</div></div>
      <div class="field"><label>Payment date</label><input type="date" name="pdate" value="${todayISO()}"></div>`,
      { onSubmit: d => {
        const amt = num(d.amt); if (amt <= 0) return 'Please enter an amount greater than zero.';
        v.paid = (+v.paid || 0) + amt;
        let p = state.payments.find(x => x.vendor === v.company);
        if (!p) { p = { id: uid(), vendor: v.company, total: v.price, deposit: v.deposit, paid: 0, due: v.due, status: 'Unpaid' }; state.payments.push(p); }
        p.paid = (+p.paid || 0) + amt; p.total = v.price;
        p.status = p.paid >= p.total && p.total ? 'Paid' : 'Partial';
        save(); showSection('vendors'); toast(`Payment of ${fmtMoney(amt)} logged`); return null;
      }});
  });
  const ab = $('[data-act="add"]'); if (ab) ab.onclick = add;
  const eb = $('[data-act="add-vendor"]'); if (eb) eb.onclick = add;
};

/* ---------------- Payments ---------------- */
RENDER.payments = function () {
  const t = todayISO();
  const rows = state.payments.map(p => ({ ...p, bal: (+p.total || 0) - (+p.paid || 0) }));
  const totOwed = rows.reduce((a, p) => a + Math.max(0, p.bal), 0);
  const totPaid = rows.reduce((a, p) => a + (+p.paid || 0), 0);
  const upcoming = rows.filter(p => p.bal > 0 && p.due && p.due >= t).sort((a, b) => a.due.localeCompare(b.due));
  const overdue = rows.filter(p => p.bal > 0 && p.due && p.due < t);
  return `
  ${sectionHead('Contract & Payment Tracker', 'Never miss a deposit or deadline.', `
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add payment</button>`)}
  <div class="grid cols-3 mb-4">
    <div class="card stat-card"><div class="stat-num">${fmtMoney(totPaid)}</div><div class="stat-label">Total paid</div></div>
    <div class="card stat-card"><div class="stat-num" style="color:var(--warning)">${fmtMoney(totOwed)}</div><div class="stat-label">Outstanding balance</div></div>
    <div class="card stat-card"><div class="stat-num" style="color:var(--error)">${overdue.length}</div><div class="stat-label">Overdue payments</div></div>
  </div>
  ${overdue.length ? `<div class="card mb-4" style="border-color:var(--error)"><h3>${icon('alert', 18)} Overdue</h3>${overdue.map(p => `<div class="reminder-item"><span class="badge red">Overdue</span><div><strong>${esc(p.vendor)}</strong> — ${fmtMoney(p.bal)} <small>was due ${fmtDate(p.due)}</small></div></div>`).join('')}</div>` : ''}
  ${upcoming.length ? `<div class="card mb-4"><h3>${icon('clock', 18)} Upcoming payments</h3>${upcoming.slice(0, 5).map(p => `<div class="reminder-item"><span class="badge amber">${fmtDate(p.due)}</span><div><strong>${esc(p.vendor)}</strong> — ${fmtMoney(p.bal)} remaining</div></div>`).join('')}</div>` : ''}
  ${rows.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Vendor</th><th>Total</th><th>Deposit</th><th>Paid</th><th>Balance</th><th>Due</th><th>Status</th><th class="no-print"></th></tr></thead><tbody>
    ${rows.map(p => `<tr>
      <td><strong>${esc(p.vendor)}</strong></td><td>${fmtMoney(p.total)}</td><td>${fmtMoney(p.deposit)}</td><td>${fmtMoney(p.paid)}</td>
      <td style="font-weight:700;color:${p.bal > 0 ? 'var(--warning)' : 'var(--success)'}">${fmtMoney(Math.max(0, p.bal))}</td>
      <td>${p.due ? fmtDate(p.due) : '—'}</td><td>${badge(p.status, statusTone(p.status))}</td>
      <td class="no-print" style="white-space:nowrap">
        <button class="icon-btn" style="width:32px;height:32px" data-edit="${p.id}" title="Edit">${icon('edit', 14)}</button>
        <button class="icon-btn" style="width:32px;height:32px" data-del="${p.id}" title="Delete">${icon('trash', 14)}</button>
      </td></tr>`).join('')}
  </tbody></table></div>`
  : emptyState('card', 'No payments tracked', 'Add your first payment to stay on top of deposits.', 'Add payment', 'add-payment')}`;
};
RENDER.payments.after = function () {
  const num = v => v === '' ? 0 : Math.max(0, Number(v) || 0);
  const form = (p = {}) => `
    <div class="field"><label>Vendor <span class="req">*</span></label><input type="text" name="vendor" list="vendorlist" value="${esc(p.vendor || '')}" required><datalist id="vendorlist">${state.vendors.map(v => `<option value="${esc(v.company)}">`).join('')}</datalist></div>
    <div class="form-row">
      <div class="field"><label>Total amount ($)</label><input type="number" name="total" min="0" step="1" value="${esc(p.total ?? '')}"></div>
      <div class="field"><label>Deposit ($)</label><input type="number" name="deposit" min="0" step="1" value="${esc(p.deposit ?? '')}"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Amount paid ($)</label><input type="number" name="paid" min="0" step="1" value="${esc(p.paid ?? '')}"></div>
      <div class="field"><label>Due date</label><input type="date" name="due" value="${esc(p.due || '')}"></div>
    </div>`;
  const add = () => openModal('Add payment', form(), { onSubmit: d => {
    if (!d.vendor.trim()) return 'Please enter the vendor.';
    const total = num(d.total), paid = num(d.paid);
    state.payments.push({ id: uid(), vendor: d.vendor.trim(), total, deposit: num(d.deposit), paid, due: d.due, status: paid >= total && total ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid') });
    save(); showSection('payments'); toast('Payment added'); return null;
  }});
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const p = state.payments.find(x => x.id === b.dataset.edit);
    openModal('Edit payment', form(p), { onSubmit: d => {
      if (!d.vendor.trim()) return 'Please enter the vendor.';
      const total = num(d.total), paid = num(d.paid);
      Object.assign(p, { vendor: d.vendor.trim(), total, deposit: num(d.deposit), paid, due: d.due, status: paid >= total && total ? 'Paid' : (paid > 0 ? 'Partial' : 'Unpaid') });
      save(); showSection('payments'); toast('Payment updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const p = state.payments.find(x => x.id === b.dataset.del);
    confirmAction(`Delete payment record for "${p.vendor}"?`, () => { state.payments = state.payments.filter(x => x.id !== p.id); save(); showSection('payments'); });
  });
  const ab = $('[data-act="add"]'); if (ab) ab.onclick = add;
  const eb = $('[data-act="add-payment"]'); if (eb) eb.onclick = add;
};

/* ---------------- Timeline + Emergency Kit ---------------- */
let tlTab = 'day';
function tlFormHTML(e = {}) {
  return `
    <div class="field"><label>Event name <span class="req">*</span></label><input type="text" name="name" value="${esc(e.name || '')}" required placeholder="e.g. First Dance"></div>
    <div class="form-row">
      <div class="field"><label>Time <span class="req">*</span></label><input type="time" name="time" value="${esc(e.time || '')}" required></div>
      <div class="field"><label>Duration</label><input type="text" name="duration" value="${esc(e.duration || '')}" placeholder="e.g. 30 min"></div>
    </div>
    <div class="field"><label>Location</label><input type="text" name="location" value="${esc(e.location || '')}"></div>
    <div class="field"><label>Notes</label><textarea name="notes">${esc(e.notes || '')}</textarea></div>`;
}
RENDER.timeline = function () {
  const tabs = `<div class="tabs no-print">
    <button class="tab ${tlTab === 'day' ? 'active' : ''}" data-tltab="day">${icon('clock', 14)} Wedding Day</button>
    <button class="tab ${tlTab === 'kit' ? 'active' : ''}" data-tltab="kit">${icon('alert', 14)} Emergency Kit</button></div>`;
  if (tlTab === 'kit') {
    const done = state.emergency.filter(e => e.done).length;
    return `
    ${sectionHead('Emergency Kit', 'Wedding-day essentials — pack these and relax.')}
    ${tabs}
    <div class="card mb-4"><div class="flex justify-between items-center mb-2"><strong>${done} of ${state.emergency.length} packed</strong><span>${Math.round(done / Math.max(1, state.emergency.length) * 100)}%</span></div>${progressBar(done / Math.max(1, state.emergency.length) * 100)}</div>
    <div class="card">
      ${state.emergency.map(e => `
        <div class="check-item"><input type="checkbox" class="check" data-ek="${e.id}" ${e.done ? 'checked' : ''}>
          <div class="txt ${e.done ? 'done' : ''}">${esc(e.text)}</div>
          <div class="row-actions no-print"><button class="icon-btn" style="width:30px;height:30px" data-ekdel="${e.id}">${icon('trash', 13)}</button></div>
        </div>`).join('')}
      <div class="flex gap-2 mt-4 no-print"><input type="text" id="ekNew" placeholder="Add a custom item…" style="flex:1"><button class="btn btn-primary btn-sm" id="ekAdd">${icon('plus', 14)} Add</button></div>
    </div>`;
  }
  const evs = state.timeline.slice().sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  return `
  ${sectionHead('Wedding Day Timeline', 'Every moment, beautifully ordered.', `
    <button class="btn no-print" data-act="print">${icon('printer', 15)} Print</button>
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} Add event</button>`)}
  ${tabs}
  ${evs.length ? `<div class="card"><div class="tl">
    ${evs.map(e => `<div class="tl-item">
      <div class="tl-time">${fmtTime(e.time)}</div>
      <h4>${esc(e.name)}</h4>
      <div class="meta">${[e.location, e.duration].filter(Boolean).map(esc).join(' · ')}</div>
      ${e.notes ? `<p class="small muted mt-2">${esc(e.notes)}</p>` : ''}
      <div class="actions-row no-print mt-2">
        <button class="btn btn-sm" data-edit="${e.id}">${icon('edit', 13)} Edit</button>
        <button class="btn btn-sm btn-danger" data-del="${e.id}">${icon('trash', 13)}</button>
      </div>
    </div>`).join('')}
  </div></div>`
  : emptyState('clock', 'No timeline events', 'Build your wedding-day schedule.', 'Add event', 'add-event')}`;
};
RENDER.timeline.after = function () {
  $$('#view [data-tltab]').forEach(b => b.onclick = () => { tlTab = b.dataset.tltab; showSection('timeline'); });
  if (tlTab === 'kit') {
    $$('#view [data-ek]').forEach(cb => cb.onchange = () => {
      const e = state.emergency.find(x => x.id === cb.dataset.ek);
      e.done = cb.checked; save(); showSection('timeline');
    });
    $$('#view [data-ekdel]').forEach(b => b.onclick = () => {
      state.emergency = state.emergency.filter(x => x.id !== b.dataset.ekdel);
      save(); showSection('timeline');
    });
    const addEk = () => {
      const inp = $('#ekNew'); const v = inp.value.trim();
      if (!v) { toast('Type an item first', 'alert'); return; }
      state.emergency.push({ id: uid(), text: v, done: false });
      save(); showSection('timeline'); toast('Added to emergency kit');
    };
    $('#ekAdd').onclick = addEk;
    $('#ekNew').addEventListener('keydown', e => { if (e.key === 'Enter') addEk(); });
    return;
  }
  const add = () => openModal('Add timeline event', tlFormHTML(), { onSubmit: d => {
    if (!d.name.trim()) return 'Please enter an event name.';
    if (!d.time) return 'Please choose a time.';
    state.timeline.push({ id: uid(), name: d.name.trim(), time: d.time, location: d.location.trim(), duration: d.duration.trim(), notes: d.notes.trim() });
    save(); showSection('timeline'); toast('Event added'); return null;
  }});
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const e = state.timeline.find(x => x.id === b.dataset.edit);
    openModal('Edit event', tlFormHTML(e), { onSubmit: d => {
      if (!d.name.trim()) return 'Please enter an event name.';
      if (!d.time) return 'Please choose a time.';
      Object.assign(e, { name: d.name.trim(), time: d.time, location: d.location.trim(), duration: d.duration.trim(), notes: d.notes.trim() });
      save(); showSection('timeline'); toast('Event updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const e = state.timeline.find(x => x.id === b.dataset.del);
    confirmAction(`Delete "${e.name}" from the timeline?`, () => { state.timeline = state.timeline.filter(x => x.id !== e.id); save(); showSection('timeline'); });
  });
  const ab = $('[data-act="add"]'); if (ab) ab.onclick = add;
  const eb = $('[data-act="add-event"]'); if (eb) eb.onclick = add;
  const pb = $('[data-act="print"]'); if (pb) pb.onclick = () => window.print();
};

/* ============================================================
   Attire · Flowers · Mood Board · Palette · Honeymoon · Notes · Settings
   ============================================================ */
const ATTIRE_STATUS = ['Not Started', 'Purchased', 'Ordered', 'Fitted', 'Altered', 'Ready'];
const ATTIRE_GROUPS = [['bride', 'Bride'], ['groom', 'Groom'], ['party', 'Wedding Party']];
RENDER.attire = function () {
  return `
  ${sectionHead('Dress & Attire Planner', 'Every outfit, from veil to boutonniere.')}
  <div class="grid cols-3">
  ${ATTIRE_GROUPS.map(([key, label]) => {
    const items = state.attire[key] || [];
    const ready = items.filter(i => i.status === 'Ready' || i.status === 'Purchased').length;
    return `<div class="card">
      <h3>${icon('shirt', 18)} ${label} <span class="badge ${ready === items.length && items.length ? 'green' : 'gray'}">${ready}/${items.length}</span></h3>
      ${items.map(i => `
        <div class="check-item">
          <div class="txt"><div>${esc(i.name)}</div></div>
          <select data-ast="${key}:${i.id}" style="width:auto;padding:6px 10px;font-size:.82rem" aria-label="Status">
            ${ATTIRE_STATUS.map(s => `<option ${i.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <div class="row-actions no-print"><button class="icon-btn" style="width:30px;height:30px" data-adel="${key}:${i.id}">${icon('trash', 13)}</button></div>
        </div>`).join('')}
      <div class="flex gap-2 mt-2 no-print"><input type="text" id="anew-${key}" placeholder="Add item…" style="flex:1"><button class="btn btn-sm btn-primary" data-aadd="${key}">${icon('plus', 13)}</button></div>
    </div>`; }).join('')}
  </div>`;
};
RENDER.attire.after = function () {
  $$('#view [data-ast]').forEach(sel => sel.onchange = () => {
    const [key, id] = sel.dataset.ast.split(':');
    const it = state.attire[key].find(x => x.id === id);
    it.status = sel.value; save(); toast('Status updated');
  });
  $$('#view [data-adel]').forEach(b => b.onclick = () => {
    const [key, id] = b.dataset.adel.split(':');
    state.attire[key] = state.attire[key].filter(x => x.id !== id);
    save(); showSection('attire');
  });
  $$('#view [data-aadd]').forEach(b => b.onclick = () => {
    const key = b.dataset.aadd; const inp = $('#anew-' + key);
    const v = inp.value.trim(); if (!v) { toast('Type an item name first', 'alert'); return; }
    state.attire[key].push({ id: uid(), name: v, status: 'Not Started' });
    save(); showSection('attire'); toast('Item added');
  });
};

/* ---------------- Flowers & Decor ---------------- */
RENDER.flowers = function () {
  const est = state.flowers.reduce((a, f) => a + (+f.estimated || 0), 0);
  const act = state.flowers.reduce((a, f) => a + (+f.actual || 0), 0);
  return `
  ${sectionHead('Flowers & Decor', 'Petals, candles, and everything pretty.')}
  <div class="grid cols-3 mb-4">
    <div class="card stat-card"><div class="stat-num">${fmtMoney(est)}</div><div class="stat-label">Estimated</div></div>
    <div class="card stat-card"><div class="stat-num">${fmtMoney(act)}</div><div class="stat-label">Actual spent</div></div>
    <div class="card stat-card"><div class="stat-num">${fmtMoney(est - act)}</div><div class="stat-label">Remaining</div></div>
  </div>
  <div class="card">
    <div class="actions-row mb-4 no-print"><button class="btn btn-primary btn-sm" data-act="add">${icon('plus', 14)} Add item</button></div>
    ${state.flowers.map(f => `
      <div class="check-item">
        <div class="txt"><div><strong>${esc(f.name)}</strong></div>
          <div class="meta">Est. ${fmtMoney(f.estimated)} · Actual ${fmtMoney(f.actual)}</div></div>
        <div class="row-actions no-print">
          <button class="icon-btn" style="width:32px;height:32px" data-edit="${f.id}">${icon('edit', 14)}</button>
          <button class="icon-btn" style="width:32px;height:32px" data-del="${f.id}">${icon('trash', 14)}</button>
        </div>
      </div>`).join('')}
  </div>`;
};
RENDER.flowers.after = function () {
  const num = v => v === '' ? 0 : Math.max(0, Number(v) || 0);
  const form = (f = {}) => `
    <div class="field"><label>Item <span class="req">*</span></label><input type="text" name="name" value="${esc(f.name || '')}" required></div>
    <div class="form-row">
      <div class="field"><label>Estimated cost ($)</label><input type="number" name="estimated" min="0" value="${esc(f.estimated ?? '')}"></div>
      <div class="field"><label>Actual cost ($)</label><input type="number" name="actual" min="0" value="${esc(f.actual ?? '')}"></div>
    </div>`;
  $('[data-act="add"]').onclick = () => openModal('Add decor item', form(), { onSubmit: d => {
    if (!d.name.trim()) return 'Please enter an item name.';
    state.flowers.push({ id: uid(), name: d.name.trim(), estimated: num(d.estimated), actual: num(d.actual) });
    save(); showSection('flowers'); toast('Item added'); return null;
  }});
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const f = state.flowers.find(x => x.id === b.dataset.edit);
    openModal('Edit item', form(f), { onSubmit: d => {
      if (!d.name.trim()) return 'Please enter an item name.';
      Object.assign(f, { name: d.name.trim(), estimated: num(d.estimated), actual: num(d.actual) });
      save(); showSection('flowers'); toast('Item updated'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    const f = state.flowers.find(x => x.id === b.dataset.del);
    confirmAction(`Delete "${f.name}"?`, () => { state.flowers = state.flowers.filter(x => x.id !== f.id); save(); showSection('flowers'); });
  });
};

/* ---------------- Mood Board ---------------- */
const MOOD_CATS = ['Colors', 'Flowers', 'Dresses', 'Decor', 'Invitations', 'Cakes', 'Hairstyles', 'Photo Ideas'];
let moodCat = 'all';
function moodPlaceholder(label) {
  const h = [...label].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `background:linear-gradient(135deg,hsl(${h},38%,88%),hsl(${(h + 40) % 360},42%,76%))`;
}
RENDER.moodboard = function () {
  const list = state.moodboard.filter(m => moodCat === 'all' || m.category === moodCat);
  return `
  ${sectionHead('Inspiration Mood Board', 'Collect every beautiful idea in one place.')}
  <div class="tabs no-print">
    <button class="tab ${moodCat === 'all' ? 'active' : ''}" data-mc="all">All</button>
    ${MOOD_CATS.map(c => `<button class="tab ${moodCat === c ? 'active' : ''}" data-mc="${c}">${c}</button>`).join('')}
    <span style="flex:1"></span>
    <button class="btn btn-primary btn-sm" data-act="add">${icon('plus', 14)} Add inspiration</button>
  </div>
  ${list.length ? `<div class="mood-grid">
    ${list.map(m => `<div class="mood-card">
      ${m.url ? `<img src="${esc(m.url)}" alt="${esc(m.label)}" loading="lazy" onerror="this.style.display='none'">` : `<div style="height:150px;${moodPlaceholder(m.label)};display:flex;align-items:center;justify-content:center">${icon('image', 34)}</div>`}
      <div class="mood-meta"><strong>${esc(m.label)}</strong><small>${esc(m.category)}</small>
        <div class="mt-2 no-print"><button class="btn btn-sm btn-danger" data-del="${m.id}">${icon('trash', 13)} Remove</button></div>
      </div>
    </div>`).join('')}
  </div>`
  : emptyState('image', 'Your board is empty', 'Pin colors, flowers, dresses and decor ideas here.', 'Add inspiration', 'add-mood')}`;
};
RENDER.moodboard.after = function () {
  $$('#view [data-mc]').forEach(b => b.onclick = () => { moodCat = b.dataset.mc; showSection('moodboard'); });
  const add = () => openModal('Add inspiration', `
    <div class="field"><label>Label <span class="req">*</span></label><input type="text" name="label" required placeholder="e.g. Blush garden bouquet"></div>
    <div class="field"><label>Category</label><select name="category">${MOOD_CATS.map(c => `<option>${c}</option>`).join('')}</select></div>
    <div class="field"><label>Image URL <span class="hint">(optional — paste any image link)</span></label><input type="url" name="url" placeholder="https://…"></div>`,
    { onSubmit: d => {
      if (!d.label.trim()) return 'Please enter a label.';
      if (d.url && !/^https?:\/\/.+/i.test(d.url.trim())) return 'Please enter a valid image URL starting with http.';
      state.moodboard.push({ id: uid(), label: d.label.trim(), category: d.category, url: d.url.trim() });
      save(); showSection('moodboard'); toast('Added to mood board'); return null;
    }});
  const ab = $('[data-act="add"]'); if (ab) ab.onclick = add;
  const eb = $('[data-act="add-mood"]'); if (eb) eb.onclick = add;
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    confirmAction('Remove this inspiration?', () => { state.moodboard = state.moodboard.filter(x => x.id !== b.dataset.del); save(); showSection('moodboard'); });
  });
};

/* ---------------- Color Palette ---------------- */
RENDER.palette = function () {
  return `
  ${sectionHead('Wedding Color Palette', 'Build your signature palette — click any swatch to copy its HEX.')}
  <div class="card mb-4">
    <div class="flex gap-2 no-print" style="flex-wrap:wrap;align-items:flex-end">
      <div class="field" style="margin:0"><label>Pick a color</label><input type="color" id="palColor" value="#b76e79" style="width:64px;height:42px;padding:4px"></div>
      <div class="field" style="margin:0;flex:1;min-width:160px"><label>Name it</label><input type="text" id="palName" placeholder="e.g. Dusty Rose"></div>
      <button class="btn btn-primary" id="palAdd">${icon('plus', 15)} Add color</button>
    </div>
  </div>
  ${state.palette.length ? `<div class="palette-grid">
    ${state.palette.map(c => `<div class="swatch" data-copy="${c.id}" title="Click to copy ${esc(c.hex)}">
      <div class="color" style="background:${esc(c.hex)}"></div>
      <div class="hex">${esc(c.hex).toUpperCase()}<br><small class="muted">${esc(c.name || '')}</small></div>
      <div class="no-print" style="padding:0 8px 8px;text-align:center"><button class="btn btn-sm btn-danger" data-del="${c.id}">${icon('trash', 12)}</button></div>
    </div>`).join('')}
  </div>
  <div class="card mt-4"><h3>Palette preview</h3><div class="flex" style="height:56px;border-radius:12px;overflow:hidden;border:1px solid var(--border-soft)">
    ${state.palette.map(c => `<div style="flex:1;background:${esc(c.hex)}" title="${esc(c.name || c.hex)}"></div>`).join('')}
  </div></div>`
  : emptyState('palette', 'No colors yet', 'Build the palette of your dreams.', '', '')}`;
};
RENDER.palette.after = function () {
  $('#palAdd').onclick = () => {
    const hex = $('#palColor').value;
    const name = $('#palName').value.trim();
    state.palette.push({ id: uid(), hex, name });
    save(); showSection('palette'); toast('Color added');
  };
  $$('#view [data-copy]').forEach(sw => sw.onclick = e => {
    if (e.target.closest('[data-del]')) return;
    const c = state.palette.find(x => x.id === sw.dataset.copy);
    const done = () => toast(c.hex.toUpperCase() + ' copied');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c.hex).then(done, () => toast('Copy failed', 'alert'));
    else toast('Copy not supported in this browser', 'alert');
  });
  $$('#view [data-del]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    state.palette = state.palette.filter(x => x.id !== b.dataset.del);
    save(); showSection('palette');
  });
};

/* ---------------- Honeymoon ---------------- */
RENDER.honeymoon = function () {
  const h = state.honeymoon;
  const done = h.packing.filter(p => p.done).length;
  const v = k => esc(h[k] || '');
  return `
  ${sectionHead('Honeymoon Planner', 'The trip of a lifetime, planned to perfection.')}
  <div class="grid cols-2">
    <div class="card">
      <h3>${icon('send', 18)} Trip details</h3>
      <form id="hmForm" novalidate>
        <div class="field"><label>Destination <span class="req">*</span></label><input type="text" name="destination" value="${v('destination')}" required></div>
        <div class="form-row">
          <div class="field"><label>Departure</label><input type="date" name="startDate" value="${v('startDate')}"></div>
          <div class="field"><label>Return</label><input type="date" name="endDate" value="${v('endDate')}"></div>
        </div>
        <div class="field"><label>Flights</label><input type="text" name="flights" value="${v('flights')}"></div>
        <div class="field"><label>Hotel</label><input type="text" name="hotel" value="${v('hotel')}"></div>
        <div class="field"><label>Transportation</label><input type="text" name="transport" value="${v('transport')}"></div>
        <div class="field"><label>Activities</label><textarea name="activities">${v('activities')}</textarea></div>
        <div class="form-row">
          <div class="field"><label>Budget ($)</label><input type="number" name="budget" min="0" value="${v('budget') ?? ''}"></div>
          <div class="field"><label>Booking status</label><select name="bookingStatus">${['Not Started', 'Researching', 'In Progress', 'Booked'].map(s => `<option ${h.bookingStatus === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
        </div>
        <button type="submit" class="btn btn-primary">${icon('check', 15)} Save honeymoon</button>
      </form>
    </div>
    <div class="card">
      <h3>${icon('checklist', 18)} Packing list <span class="badge ${done === h.packing.length && h.packing.length ? 'green' : 'gray'}">${done}/${h.packing.length}</span></h3>
      <div class="mb-2">${progressBar(h.packing.length ? done / h.packing.length * 100 : 0, true)}</div>
      ${h.packing.map(p => `
        <div class="check-item"><input type="checkbox" class="check" data-pk="${p.id}" ${p.done ? 'checked' : ''}>
          <div class="txt ${p.done ? 'done' : ''}">${esc(p.text)}</div>
          <div class="row-actions no-print"><button class="icon-btn" style="width:30px;height:30px" data-pkdel="${p.id}">${icon('trash', 13)}</button></div>
        </div>`).join('')}
      <div class="flex gap-2 mt-4 no-print"><input type="text" id="pkNew" placeholder="Add packing item…" style="flex:1"><button class="btn btn-primary btn-sm" id="pkAdd">${icon('plus', 14)}</button></div>
    </div>
  </div>`;
};
RENDER.honeymoon.after = function () {
  $('#hmForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (!f.destination.value.trim()) { toast('Please enter a destination', 'alert'); return; }
    ['destination', 'startDate', 'endDate', 'flights', 'hotel', 'transport', 'activities', 'bookingStatus'].forEach(n => state.honeymoon[n] = f[n].value.trim());
    state.honeymoon.budget = f.budget.value === '' ? '' : Math.max(0, +f.budget.value || 0);
    save(); toast('Honeymoon saved');
  });
  $$('#view [data-pk]').forEach(cb => cb.onchange = () => {
    const p = state.honeymoon.packing.find(x => x.id === cb.dataset.pk);
    p.done = cb.checked; save(); showSection('honeymoon');
  });
  $$('#view [data-pkdel]').forEach(b => b.onclick = () => {
    state.honeymoon.packing = state.honeymoon.packing.filter(x => x.id !== b.dataset.pkdel);
    save(); showSection('honeymoon');
  });
  const addPk = () => {
    const inp = $('#pkNew'); const t = inp.value.trim();
    if (!t) { toast('Type an item first', 'alert'); return; }
    state.honeymoon.packing.push({ id: uid(), text: t, done: false });
    save(); showSection('honeymoon'); toast('Added to packing list');
  };
  $('#pkAdd').onclick = addPk;
  $('#pkNew').addEventListener('keydown', e => { if (e.key === 'Enter') addPk(); });
};

/* ---------------- Notes ---------------- */
const NOTE_CATS = ['Venue', 'Vendors', 'Guests', 'Budget', 'Ceremony', 'Reception', 'Honeymoon', 'General'];
let noteCat = 'all';
RENDER.notes = function () {
  const q = (sectionQuery.notes || '').toLowerCase();
  let list = state.notes.slice().sort((a, b) => b.updatedAt - a.updatedAt);
  if (noteCat !== 'all') list = list.filter(n => n.category === noteCat);
  if (q) list = list.filter(n => (n.title + ' ' + n.body).toLowerCase().includes(q));
  return `
  ${sectionHead('Notes & Documents', 'Every idea, safely kept.', `
    <button class="btn btn-primary" data-act="add">${icon('plus', 15)} New note</button>`)}
  <div class="toolbar no-print">
    <div class="tabs" style="margin:0">
      <button class="tab ${noteCat === 'all' ? 'active' : ''}" data-nc="all">All</button>
      ${NOTE_CATS.map(c => `<button class="tab ${noteCat === c ? 'active' : ''}" data-nc="${c}">${c}</button>`).join('')}
    </div>
    <input type="text" id="noteSearch" class="grow" placeholder="Search notes…" value="${esc(sectionQuery.notes || '')}">
  </div>
  ${list.length ? `<div class="grid cols-3">
    ${list.map(n => `<div class="card hoverable">
      <div class="flex justify-between items-center mb-2"><span class="badge gold">${esc(n.category)}</span><small class="muted">${new Date(n.updatedAt).toLocaleDateString()}</small></div>
      <h3 style="font-size:1.15rem">${esc(n.title)}</h3>
      <p class="muted small">${esc(n.body.slice(0, 140))}${n.body.length > 140 ? '…' : ''}</p>
      <div class="actions-row no-print">
        <button class="btn btn-sm" data-edit="${n.id}">${icon('edit', 13)} Open</button>
        <button class="icon-btn" style="width:32px;height:32px" data-del="${n.id}" title="Delete">${icon('trash', 14)}</button>
      </div>
    </div>`).join('')}
  </div>`
  : emptyState('note', 'No notes yet', 'Jot down ideas, lists and reminders.', 'New note', 'add-note')}`;
};
RENDER.notes.after = function () {
  $$('#view [data-nc]').forEach(b => b.onclick = () => { noteCat = b.dataset.nc; showSection('notes'); });
  $('#noteSearch').addEventListener('input', debounce(e => { sectionQuery.notes = e.target.value; showSection('notes'); const i = $('#noteSearch'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 350));
  const form = (n = {}) => `
    <div class="field"><label>Title <span class="req">*</span></label><input type="text" name="title" value="${esc(n.title || '')}" required></div>
    <div class="field"><label>Category</label><select name="category">${NOTE_CATS.map(c => `<option ${n.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
    <div class="field"><label>Note</label><textarea name="body" style="min-height:140px">${esc(n.body || '')}</textarea></div>`;
  const add = () => openModal('New note', form(), { onSubmit: d => {
    if (!d.title.trim()) return 'Please enter a title.';
    state.notes.push({ id: uid(), title: d.title.trim(), category: d.category, body: d.body.trim(), updatedAt: Date.now() });
    save(); showSection('notes'); toast('Note saved'); return null;
  }});
  $$('#view [data-edit]').forEach(b => b.onclick = () => {
    const n = state.notes.find(x => x.id === b.dataset.edit);
    openModal('Edit note', form(n), { onSubmit: d => {
      if (!d.title.trim()) return 'Please enter a title.';
      Object.assign(n, { title: d.title.trim(), category: d.category, body: d.body.trim(), updatedAt: Date.now() });
      save(); showSection('notes'); toast('Note saved'); return null;
    }});
  });
  $$('#view [data-del]').forEach(b => b.onclick = () => {
    confirmAction('Delete this note?', () => { state.notes = state.notes.filter(x => x.id !== b.dataset.del); save(); showSection('notes'); });
  });
  const ab = $('[data-act="add"]'); if (ab) ab.onclick = add;
  const eb = $('[data-act="add-note"]'); if (eb) eb.onclick = add;
};

/* ---------------- Settings ---------------- */
function blankData() {
  const theme = state.settings.theme;
  const d = sampleData();
  d.settings = { bride: '', groom: '', weddingDate: '', ceremonyTime: '', receptionTime: '', venue: '', location: '', style: '', notes: '', theme };
  d.checklist.forEach(c => c.done = false);
  d.tasks = []; d.guests = []; d.tables = []; d.vendors = []; d.payments = [];
  d.timeline = []; d.moodboard = []; d.notes = [];
  d.budget.categories.forEach(c => { c.estimated = 0; c.actual = 0; c.deposit = 0; c.due = ''; });
  d.budget.total = 0;
  d.flowers.forEach(f => { f.estimated = 0; f.actual = 0; });
  d.honeymoon = { destination: '', startDate: '', endDate: '', flights: '', hotel: '', transport: '', activities: '', budget: '', bookingStatus: 'Not Started', packing: [] };
  d.emergency.forEach(e => e.done = false);
  d.palette = [];
  Object.values(d.attire).flat().forEach(i => i.status = 'Not Started');
  return d;
}
RENDER.settings = function () {
  const s = state.settings;
  return `
  ${sectionHead('Settings', 'Make it yours — theme, data and backups.')}
  <div class="grid cols-2">
    <div class="card">
      <h3>${icon('gear', 18)} Preferences</h3>
      <div class="field"><label>Theme</label>
        <div class="tabs" style="margin:0">
          <button class="tab ${s.theme !== 'dark' ? 'active' : ''}" data-theme="light">${icon('sun', 14)} Light</button>
          <button class="tab ${s.theme === 'dark' ? 'active' : ''}" data-theme="dark">${icon('moon', 14)} Dark</button>
        </div>
      </div>
      <p class="muted small">Your theme choice is saved automatically and remembered on every visit.</p>
      <hr class="divider">
      <h3>${icon('heart', 18)} Quick setup</h3>
      <p class="muted small">Edit names, date, venue and more.</p>
      <button class="btn" data-act="details">${icon('edit', 15)} Edit wedding details</button>
    </div>
    <div class="card">
      <h3>${icon('download', 18)} Backup &amp; restore</h3>
      <p class="muted small">Download your entire planner as a file, or restore from a backup.</p>
      <div class="actions-row mb-4">
        <button class="btn" data-act="export">${icon('download', 15)} Export data (JSON)</button>
        <label class="btn" style="cursor:pointer">${icon('upload', 15)} Import backup<input type="file" id="importFile" accept=".json" hidden></label>
      </div>
      <hr class="divider">
      <h3>${icon('alert', 18)} Data</h3>
      <p class="muted small">Preview the planner with realistic sample data, or wipe everything and start fresh.</p>
      <div class="actions-row">
        <button class="btn btn-accent" data-act="sample">${icon('star', 15)} Load sample data</button>
        <button class="btn btn-danger" data-act="clear">${icon('trash', 15)} Clear all data</button>
      </div>
    </div>
  </div>
  <div class="card mt-4">
    <h3>About Ever After</h3>
    <p class="muted small">A premium wedding planning studio that lives in your browser. All of your data is stored privately on this device — nothing is uploaded anywhere. Use Export to keep a backup.</p>
  </div>`;
};
RENDER.settings.after = function () {
  $$('#view [data-theme]').forEach(b => b.onclick = () => {
    state.settings.theme = b.dataset.theme; save(); applyTheme(); showSection('settings'); toast('Theme saved');
  });
  $('[data-act="details"]').onclick = () => showSection('details');
  $('[data-act="export"]').onclick = exportData;
  $('#importFile').onchange = e => { if (e.target.files[0]) importData(e.target.files[0]); };
  $('[data-act="sample"]').onclick = () => confirmAction('Replace all current data with sample data?', () => {
    const theme = state.settings.theme; state = sampleData(); state.settings.theme = theme;
    save(); applyTheme(); showSection('dashboard');
  }, 'Load samples');
  $('[data-act="clear"]').onclick = () => confirmAction('Delete ALL planner data? This cannot be undone. Export a backup first if needed.', () => {
    state = blankData(); save(); applyTheme(); showSection('dashboard');
  }, 'Clear everything');
};

/* ---------------- boot ---------------- */
wireHeader();
renderNav();
applyTheme();
showSection('dashboard');
