/**
 * Skill Categorization and Risk Assessment Utility - Frontend
 * 
 * This module provides centralized categorization logic to prevent
 * duplication across components and ensure consistent risk assessment.
 * 
 * IMPORTANT: This file should be kept in sync with backend/src/utils/skillCategorization.js
 * Any changes to categorization logic should be made in both files.
 */

// Risk levels: LOW, MEDIUM, HIGH, EXTREME
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  EXTREME: 'extreme'
};

// Complete skill categorization with risk assessment
// Order matters: more specific categories should be checked first
export const SKILL_CATEGORIES = {
  'Martial Arts': {
    keywords: ['martial-arts', 'martial arts', 'karate', 'judo', 'taekwondo', 'boxing', 'kickboxing', 'mma', 'self-defense', 'jiu-jitsu', 'kung fu'],
    riskLevel: RISK_LEVELS.HIGH,
    icon: '',
    description: 'Combat and martial arts training with significant injury risk',
    sessionTemplates: [
      { name: 'Sparring Session', duration: '45 min', participants: '2', difficulty: 'Intermediate' },
      { name: 'Technique Training', duration: '60 min', participants: '2-4', difficulty: 'All Levels' },
      { name: 'Self-Defense Workshop', duration: '90 min', participants: '4-8', difficulty: 'Beginner' }
    ]
  },
  'Electrical': {
    keywords: ['electrical', 'electrician', 'wiring', 'electronics', 'circuit', 'voltage', 'power systems'],
    riskLevel: RISK_LEVELS.HIGH,
    icon: '',
    description: 'Electrical work with high risk of shock or electrocution',
    sessionTemplates: [
      { name: 'Electrical Safety Training', duration: '120 min', participants: '2-3', difficulty: 'Beginner' },
      { name: 'Circuit Installation', duration: '180 min', participants: '2', difficulty: 'Advanced' },
      { name: 'Troubleshooting Session', duration: '90 min', participants: '2', difficulty: 'Intermediate' }
    ]
  },
  'Woodworking': {
    keywords: ['woodworking', 'wood working', 'furniture making', 'cabinetry', 'joinery', 'sawing', 'power tools', 'carpentry'],
    riskLevel: RISK_LEVELS.HIGH,
    icon: '',
    description: 'Woodworking and carpentry with high risk from power tools and sharp instruments',
    sessionTemplates: [
      { name: 'Power Tool Safety', duration: '90 min', participants: '2-4', difficulty: 'Beginner' },
      { name: 'Furniture Building', duration: '240 min', participants: '2-3', difficulty: 'Intermediate' },
      { name: 'Advanced Joinery', duration: '180 min', participants: '2', difficulty: 'Advanced' }
    ]
  },
  'Health & Fitness': {
    keywords: ['fitness training', 'fitness', 'yoga', 'meditation', 'nutrition', 'cooking', 'exercise', 'health', 'wellness', 'personal training', 'strength training'],
    riskLevel: RISK_LEVELS.MEDIUM,
    icon: '',
    description: 'Health and fitness activities with moderate physical exertion risk',
    sessionTemplates: [
      { name: 'Personal Training Session', duration: '60 min', participants: '1-2', difficulty: 'All Levels' },
      { name: 'Wellness Consultation', duration: '45 min', participants: '2', difficulty: 'Beginner' },
      { name: 'Group Meditation', duration: '30 min', participants: '4-8', difficulty: 'All Levels' }
    ]
  },
  'Creative': {
    keywords: ['graphic design', 'design', 'music', 'photography', 'writing', 'painting', 'drawing', 'pottery', 'craft', 'creative', 'art'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Artistic and creative skills with minimal physical risk',
    sessionTemplates: [
      { name: '1-on-1 Design Critique', duration: '60 min', participants: '2', difficulty: 'Beginner' },
      { name: 'Portfolio Review Session', duration: '90 min', participants: '2-3', difficulty: 'Intermediate' },
      { name: 'Creative Workshop', duration: '120 min', participants: '3-6', difficulty: 'All Levels' }
    ]
  },
  'Technical': {
    keywords: ['programming', 'coding', 'web development', 'software', 'computer', 'tech', 'development', 'data', 'ai', 'machine learning'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '', 
    description: 'Technology and software skills with minimal physical risk',
    sessionTemplates: [
      { name: 'Code Review & Mentoring', duration: '45 min', participants: '2', difficulty: 'Intermediate' },
      { name: 'Pair Programming Session', duration: '120 min', participants: '2', difficulty: 'All Levels' },
      { name: 'Technical Interview Prep', duration: '60 min', participants: '2', difficulty: 'Advanced' }
    ]
  },
  'Language': {
    keywords: ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'language', 'translation'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Language learning and communication skills with minimal risk',
    sessionTemplates: [
      { name: 'Conversation Practice', duration: '30 min', participants: '2', difficulty: 'Beginner' },
      { name: 'Grammar Deep Dive', duration: '45 min', participants: '2-3', difficulty: 'Intermediate' },
      { name: 'Cultural Immersion Chat', duration: '60 min', participants: '2-4', difficulty: 'All Levels' }
    ]
  },
  'Business': {
    keywords: ['marketing', 'sales', 'finance', 'accounting', 'management', 'business', 'entrepreneurship'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Business and professional skills with minimal risk',
    sessionTemplates: [
      { name: 'Business Plan Review', duration: '90 min', participants: '2-3', difficulty: 'Intermediate' },
      { name: 'Pitch Practice Session', duration: '60 min', participants: '2-4', difficulty: 'All Levels' },
      { name: 'Strategy Workshop', duration: '120 min', participants: '3-6', difficulty: 'Advanced' }
    ]
  },
  'Practical': {
    keywords: ['repair', 'maintenance', 'plumbing', 'gardening', 'cleaning', 'organizing'],
    riskLevel: RISK_LEVELS.MEDIUM,
    icon: '',
    description: 'Practical and maintenance skills with moderate risk',
    sessionTemplates: [
      { name: 'Hands-on Tutorial', duration: '90 min', participants: '2-3', difficulty: 'Beginner' },
      { name: 'Repair Workshop', duration: '120 min', participants: '2-4', difficulty: 'Intermediate' },
      { name: 'Master Class', duration: '180 min', participants: '4-6', difficulty: 'Advanced' }
    ]
  },
  'Academic': {
    keywords: ['math', 'science', 'physics', 'chemistry', 'biology', 'history', 'geography', 'tutoring', 'teaching'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Academic subjects and tutoring with minimal risk',
    sessionTemplates: [
      { name: 'Tutoring Session', duration: '60 min', participants: '2', difficulty: 'All Levels' },
      { name: 'Study Group', duration: '90 min', participants: '3-6', difficulty: 'All Levels' },
      { name: 'Exam Prep Workshop', duration: '120 min', participants: '4-8', difficulty: 'Intermediate' }
    ]
  }
};

/**
 * Categorize a skill based on its name
 * @param {string} skill - The skill name to categorize
 * @returns {string} The category name or 'Other' if no match found
 */
export function categorizeSkill(skill) {
  if (!skill || typeof skill !== 'string') {
    return 'Other';
  }
  
  const skillLower = skill.toLowerCase();
  
  for (const [category, data] of Object.entries(SKILL_CATEGORIES)) {
    if (data.keywords.some(keyword => skillLower.includes(keyword))) {
      return category;
    }
  }
  
  return 'Other';
}

/**
 * Get risk level for a skill
 * @param {string} skill - The skill name to assess
 * @returns {string} Risk level: 'low', 'medium', 'high', or 'extreme'
 */
export function getSkillRiskLevel(skill) {
  const category = categorizeSkill(skill);
  
  if (category === 'Other') {
    return RISK_LEVELS.LOW; // Default to low risk for unknown skills
  }
  
  return SKILL_CATEGORIES[category].riskLevel;
}

/**
 * Get category metadata including risk level and description
 * @param {string} category - The category name
 * @returns {object} Category metadata or null if not found
 */
export function getCategoryMetadata(category) {
  return SKILL_CATEGORIES[category] || null;
}

/**
 * Get all available skill categories
 * @returns {string[]} Array of category names
 */
export function getSkillCategories() {
  return [
    ...Object.keys(SKILL_CATEGORIES),
    'Other'
  ];
}

/**
 * Get categories filtered by risk level
 * @param {string} riskLevel - Filter by risk level ('low', 'medium', 'high', 'extreme')
 * @returns {string[]} Array of category names matching the risk level
 */
export function getCategoriesByRiskLevel(riskLevel) {
  return Object.entries(SKILL_CATEGORIES)
    .filter(([, data]) => data.riskLevel === riskLevel)
    .map(([category]) => category);
}

/**
 * Check if a skill requires liability waiver based on risk level
 * @param {string} skill - The skill name to check
 * @returns {boolean} True if liability waiver is required
 */
export function requiresLiabilityWaiver(skill) {
  const riskLevel = getSkillRiskLevel(skill);
  return riskLevel === RISK_LEVELS.HIGH || riskLevel === RISK_LEVELS.EXTREME;
}

/**
 * Get all skills that require liability waivers
 * @returns {string[]} Array of high-risk category names
 */
export function getHighRiskCategories() {
  return getCategoriesByRiskLevel(RISK_LEVELS.HIGH)
    .concat(getCategoriesByRiskLevel(RISK_LEVELS.EXTREME));
}

/**
 * Get skills formatted for display with risk indicators
 * @returns {Array} Array of skill categories with extended metadata
 */
export function getSkillCategoriesForDisplay() {
  return Object.entries(SKILL_CATEGORIES).map(([name, data]) => ({
    name,
    ...data,
    requiresWaiver: data.riskLevel === RISK_LEVELS.HIGH || data.riskLevel === RISK_LEVELS.EXTREME,
    riskIndicator: data.riskLevel === RISK_LEVELS.HIGH ? '⚠️' : data.riskLevel === RISK_LEVELS.EXTREME ? '🚨' : ''
  }));
}