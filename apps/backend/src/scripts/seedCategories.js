// Add-only seed for categories + category_requirements
const { initializeFirebase, getDatabase } = require('../config/firebase');

const CATS = [
  // Lessons / tutoring / fitness
  { slug: 'tutoring', name: 'Tutoring & Lessons', class: 'E' },
  { slug: 'music', name: 'Music Lessons', class: 'E' },
  { slug: 'fitness', name: 'Personal Training', class: 'E' },

  // Odd Jobs – launch set
  { slug: 'handyman', name: 'Handyman (basic)', class: 'B' },
  { slug: 'cleaning', name: 'Cleaning (non-bio)', class: 'F' },
  { slug: 'yard-farm', name: 'Yard & Farm (non-mechanical)', class: 'B' },
  { slug: 'moving-help', name: 'Moving Help (no truck)', class: 'A' },
  { slug: 'errands', name: 'Errands & Organizing', class: 'A' },

  // Phased (Coming Soon)
  { slug: 'electrical', name: 'Electrical (licensed)', class: 'C', comingSoon: true },
  { slug: 'plumbing', name: 'Plumbing (licensed)', class: 'C', comingSoon: true },
  { slug: 'hvac', name: 'HVAC (licensed)', class: 'C', comingSoon: true },
  { slug: 'tree-work', name: 'Tree Work (higher risk)', class: 'C', comingSoon: true },
  { slug: 'transport', name: 'Transport/Hauling (provider vehicle)', class: 'D', comingSoon: true },
];

const REQUIREMENTS = {
  // Declarative rules by category slug
  // booleans are the *gate*; text is presented in UI
  'tutoring':          { requires_license:false, requires_gl:false, requires_background_check:false, notes:'Guardian present for minors (MVP).' },
  'music':             { requires_license:false, requires_gl:false, requires_background_check:false },
  'fitness':           { requires_license:false, requires_gl:false, requires_background_check:false, recommends:['CPR/First Aid','PT cert (NASM/ACE)'] },

  'handyman':          { requires_license:false, requires_gl:true,  min_gl_per_occurrence_cents:100000000, min_gl_aggregate_cents:200000000, notes:'No gas, roofing, or structural work.' },
  'cleaning':          { requires_license:false, requires_gl:false, notes:'No mold/biohazard.' },
  'yard-farm':         { requires_license:false, requires_gl:true,  min_gl_per_occurrence_cents:100000000, min_gl_aggregate_cents:200000000, notes:'No tree felling >15 ft (Coming Soon).' },
  'moving-help':       { requires_license:false, requires_gl:false },
  'errands':           { requires_license:false, requires_gl:false },

  'electrical':        { requires_license:true, requires_gl:true,  min_gl_per_occurrence_cents:100000000, min_gl_aggregate_cents:200000000 },
  'plumbing':          { requires_license:true, requires_gl:true,  min_gl_per_occurrence_cents:100000000, min_gl_aggregate_cents:200000000 },
  'hvac':              { requires_license:true, requires_gl:true,  min_gl_per_occurrence_cents:100000000, min_gl_aggregate_cents:200000000, notes:'EPA 608 required if applicable.' },
  'tree-work':         { requires_license:false, requires_gl:true,  min_gl_per_occurrence_cents:100000000, min_gl_aggregate_cents:200000000, notes:'ISA recommended; higher-risk controls Coming Soon.' },
  'transport':         { requires_license:false, requires_gl:false, requires_auto_insurance:true, notes:'No hazmat; securement rules apply.' },
};

async function run() {
  initializeFirebase();
  const db = getDatabase();
  await db.ref('categories').update(CATS.reduce((acc,c)=>({ ...acc, [c.slug]: c }),{}));
  await db.ref('category_requirements').update(REQUIREMENTS);
  console.log('Seed complete.');
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });