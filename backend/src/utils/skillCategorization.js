/**
 * Skill Categorization and Risk Assessment Utility
 * 
 * This module provides centralized categorization logic to prevent
 * duplication across components and ensure consistent risk assessment.
 * 
 * Used by:
 * - skills.js routes
 * - Future LiabilityWaiverModal component
 * - Any component requiring skill risk assessment
 */

// Risk levels: LOW, MEDIUM, HIGH, EXTREME
const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  EXTREME: 'extreme'
};

// Complete skill categorization with risk assessment
// Order matters: more specific categories should be checked first
const SKILL_CATEGORIES = {
  'Martial Arts': {
    keywords: ['martial-arts', 'martial arts', 'karate', 'judo', 'taekwondo', 'boxing', 'kickboxing', 'mma', 'self-defense', 'jiu-jitsu', 'kung fu'],
    riskLevel: RISK_LEVELS.HIGH,
    icon: '🥋',
    description: 'Combat and martial arts training with significant injury risk'
  },
  'Electrical': {
    keywords: ['electrical', 'electrician', 'wiring', 'electronics', 'circuit', 'voltage', 'power systems'],
    riskLevel: RISK_LEVELS.HIGH,
    icon: '',
    description: 'Electrical work with high risk of shock or electrocution'
  },
  'Woodworking': {
    keywords: ['woodworking', 'wood working', 'furniture making', 'cabinetry', 'joinery', 'sawing', 'power tools', 'carpentry'],
    riskLevel: RISK_LEVELS.HIGH,
    icon: '',
    description: 'Woodworking and carpentry with high risk from power tools and sharp instruments'
  },
  'Health & Fitness': {
    keywords: ['fitness training', 'fitness', 'yoga', 'meditation', 'nutrition', 'cooking', 'exercise', 'health', 'wellness', 'personal training', 'strength training'],
    riskLevel: RISK_LEVELS.MEDIUM,
    icon: '',
    description: 'Health and fitness activities with moderate physical exertion risk'
  },
  'Creative': {
    keywords: ['graphic design', 'design', 'music', 'photography', 'writing', 'painting', 'drawing', 'pottery', 'craft', 'creative', 'art'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Artistic and creative skills with minimal physical risk'
  },
  'Technical': {
    keywords: ['programming', 'coding', 'web development', 'software', 'computer', 'tech', 'development', 'data', 'ai', 'machine learning'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '', 
    description: 'Technology and software skills with minimal physical risk'
  },
  'Language': {
    keywords: ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'language', 'translation'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Language learning and communication skills with minimal risk'
  },
  'Business': {
    keywords: ['marketing', 'sales', 'finance', 'accounting', 'management', 'business', 'entrepreneurship'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Business and professional skills with minimal risk'
  },
  'Practical': {
    keywords: ['repair', 'maintenance', 'plumbing', 'gardening', 'cleaning', 'organizing'],
    riskLevel: RISK_LEVELS.MEDIUM,
    icon: '',
    description: 'Practical and maintenance skills with moderate risk'
  },
  'Academic': {
    keywords: ['math', 'science', 'physics', 'chemistry', 'biology', 'history', 'geography', 'tutoring', 'teaching'],
    riskLevel: RISK_LEVELS.LOW,
    icon: '',
    description: 'Academic subjects and tutoring with minimal risk'
  }
};

/**
 * Categorize a skill based on its name
 * @param {string} skill - The skill name to categorize
 * @returns {string} The category name or 'Other' if no match found
 */
function categorizeSkill(skill) {
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
function getSkillRiskLevel(skill) {
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
function getCategoryMetadata(category) {
  return SKILL_CATEGORIES[category] || null;
}

/**
 * Get all available skill categories
 * @returns {string[]} Array of category names
 */
function getSkillCategories() {
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
function getCategoriesByRiskLevel(riskLevel) {
  return Object.entries(SKILL_CATEGORIES)
    .filter(([, data]) => data.riskLevel === riskLevel)
    .map(([category]) => category);
}

/**
 * Check if a skill requires liability waiver based on risk level
 * @param {string} skill - The skill name to check
 * @returns {boolean} True if liability waiver is required
 */
function requiresLiabilityWaiver(skill) {
  const riskLevel = getSkillRiskLevel(skill);
  return riskLevel === RISK_LEVELS.HIGH || riskLevel === RISK_LEVELS.EXTREME;
}

/**
 * Get all skills that require liability waivers
 * @returns {string[]} Array of high-risk category names
 */
function getHighRiskCategories() {
  return getCategoriesByRiskLevel(RISK_LEVELS.HIGH)
    .concat(getCategoriesByRiskLevel(RISK_LEVELS.EXTREME));
}

module.exports = {
  categorizeSkill,
  getSkillRiskLevel,
  getCategoryMetadata,
  getSkillCategories,
  getCategoriesByRiskLevel,
  requiresLiabilityWaiver,
  getHighRiskCategories,
  RISK_LEVELS,
  SKILL_CATEGORIES
};