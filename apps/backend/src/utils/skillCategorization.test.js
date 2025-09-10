const {
  categorizeSkill,
  getSkillRiskLevel,
  getCategoryMetadata,
  getSkillCategories,
  getCategoriesByRiskLevel,
  requiresLiabilityWaiver,
  getHighRiskCategories,
  RISK_LEVELS
} = require('./skillCategorization');

describe('Skill Categorization and Risk Assessment', () => {
  describe('categorizeSkill', () => {
    test('should categorize creative skills correctly', () => {
      expect(categorizeSkill('graphic design')).toBe('Creative');
      expect(categorizeSkill('Photography')).toBe('Creative');
      expect(categorizeSkill('MUSIC PRODUCTION')).toBe('Creative');
      expect(categorizeSkill('art therapy')).toBe('Creative');
    });

    test('should categorize technical skills correctly', () => {
      expect(categorizeSkill('web development')).toBe('Technical');
      expect(categorizeSkill('Programming')).toBe('Technical');
      expect(categorizeSkill('machine learning')).toBe('Technical');
      expect(categorizeSkill('data science')).toBe('Technical');
    });

    test('should categorize fitness skills correctly', () => {
      expect(categorizeSkill('fitness training')).toBe('Health & Fitness');
      expect(categorizeSkill('yoga')).toBe('Health & Fitness');
      expect(categorizeSkill('personal training')).toBe('Health & Fitness');
    });

    test('should categorize martial arts correctly', () => {
      expect(categorizeSkill('martial arts')).toBe('Martial Arts');
      expect(categorizeSkill('karate')).toBe('Martial Arts');
      expect(categorizeSkill('boxing')).toBe('Martial Arts');
      expect(categorizeSkill('jiu-jitsu')).toBe('Martial Arts');
    });

    test('should categorize electrical work correctly', () => {
      expect(categorizeSkill('electrical work')).toBe('Electrical');
      expect(categorizeSkill('wiring')).toBe('Electrical');
      expect(categorizeSkill('electrician services')).toBe('Electrical');
    });

    test('should categorize woodworking correctly', () => {
      expect(categorizeSkill('woodworking')).toBe('Woodworking');
      expect(categorizeSkill('furniture making')).toBe('Woodworking');
      expect(categorizeSkill('cabinetry')).toBe('Woodworking');
    });

    test('should return "Other" for unrecognized skills', () => {
      expect(categorizeSkill('random skill')).toBe('Other');
      expect(categorizeSkill('unknown activity')).toBe('Other');
    });

    test('should handle edge cases', () => {
      expect(categorizeSkill('')).toBe('Other');
      expect(categorizeSkill(null)).toBe('Other');
      expect(categorizeSkill(undefined)).toBe('Other');
      expect(categorizeSkill(123)).toBe('Other');
    });
  });

  describe('getSkillRiskLevel', () => {
    test('should return low risk for creative skills', () => {
      expect(getSkillRiskLevel('graphic design')).toBe(RISK_LEVELS.LOW);
      expect(getSkillRiskLevel('photography')).toBe(RISK_LEVELS.LOW);
    });

    test('should return medium risk for fitness skills', () => {
      expect(getSkillRiskLevel('fitness training')).toBe(RISK_LEVELS.MEDIUM);
      expect(getSkillRiskLevel('yoga')).toBe(RISK_LEVELS.MEDIUM);
    });

    test('should return high risk for martial arts', () => {
      expect(getSkillRiskLevel('martial arts')).toBe(RISK_LEVELS.HIGH);
      expect(getSkillRiskLevel('boxing')).toBe(RISK_LEVELS.HIGH);
    });

    test('should return high risk for electrical work', () => {
      expect(getSkillRiskLevel('electrical work')).toBe(RISK_LEVELS.HIGH);
      expect(getSkillRiskLevel('wiring')).toBe(RISK_LEVELS.HIGH);
    });

    test('should return high risk for woodworking', () => {
      expect(getSkillRiskLevel('woodworking')).toBe(RISK_LEVELS.HIGH);
      expect(getSkillRiskLevel('furniture making')).toBe(RISK_LEVELS.HIGH);
    });

    test('should return low risk for unknown skills', () => {
      expect(getSkillRiskLevel('unknown skill')).toBe(RISK_LEVELS.LOW);
    });
  });

  describe('requiresLiabilityWaiver', () => {
    test('should require waiver for high-risk activities', () => {
      expect(requiresLiabilityWaiver('martial arts')).toBe(true);
      expect(requiresLiabilityWaiver('electrical work')).toBe(true);
      expect(requiresLiabilityWaiver('woodworking')).toBe(true);
    });

    test('should not require waiver for low-risk activities', () => {
      expect(requiresLiabilityWaiver('graphic design')).toBe(false);
      expect(requiresLiabilityWaiver('programming')).toBe(false);
      expect(requiresLiabilityWaiver('language tutoring')).toBe(false);
    });

    test('should not require waiver for medium-risk activities', () => {
      expect(requiresLiabilityWaiver('fitness training')).toBe(false);
      expect(requiresLiabilityWaiver('home repair')).toBe(false);
    });
  });

  describe('getCategoryMetadata', () => {
    test('should return metadata for valid categories', () => {
      const metadata = getCategoryMetadata('Martial Arts');
      expect(metadata).toHaveProperty('riskLevel', RISK_LEVELS.HIGH);
      expect(metadata).toHaveProperty('icon', '🥋');
      expect(metadata).toHaveProperty('description');
      expect(metadata).toHaveProperty('keywords');
    });

    test('should return null for invalid categories', () => {
      expect(getCategoryMetadata('Invalid Category')).toBeNull();
    });
  });

  describe('getSkillCategories', () => {
    test('should return all categories including Other', () => {
      const categories = getSkillCategories();
      expect(categories).toContain('Creative');
      expect(categories).toContain('Technical');
      expect(categories).toContain('Martial Arts');
      expect(categories).toContain('Electrical');
      expect(categories).toContain('Woodworking');
      expect(categories).toContain('Other');
    });
  });

  describe('getCategoriesByRiskLevel', () => {
    test('should return correct categories for each risk level', () => {
      const lowRisk = getCategoriesByRiskLevel(RISK_LEVELS.LOW);
      const mediumRisk = getCategoriesByRiskLevel(RISK_LEVELS.MEDIUM);
      const highRisk = getCategoriesByRiskLevel(RISK_LEVELS.HIGH);

      expect(lowRisk).toContain('Creative');
      expect(lowRisk).toContain('Technical');
      
      expect(mediumRisk).toContain('Health & Fitness');
      expect(mediumRisk).toContain('Practical');
      
      expect(highRisk).toContain('Martial Arts');
      expect(highRisk).toContain('Electrical');
      expect(highRisk).toContain('Woodworking');
    });
  });

  describe('getHighRiskCategories', () => {
    test('should return all high and extreme risk categories', () => {
      const highRiskCategories = getHighRiskCategories();
      expect(highRiskCategories).toContain('Martial Arts');
      expect(highRiskCategories).toContain('Electrical');
      expect(highRiskCategories).toContain('Woodworking');
    });
  });

  describe('Integration with missing categories from issue', () => {
    test('should properly handle all missing categories mentioned in issue', () => {
      // fitness - should be in Health & Fitness
      expect(categorizeSkill('fitness')).toBe('Health & Fitness');
      
      // martial-arts - should be in new Martial Arts category
      expect(categorizeSkill('martial-arts')).toBe('Martial Arts');
      
      // woodworking - should be in new Woodworking category
      expect(categorizeSkill('woodworking')).toBe('Woodworking');
      
      // electrical - should be in new Electrical category
      expect(categorizeSkill('electrical')).toBe('Electrical');
    });

    test('should provide appropriate risk levels for missing categories', () => {
      expect(getSkillRiskLevel('fitness')).toBe(RISK_LEVELS.MEDIUM);
      expect(getSkillRiskLevel('martial-arts')).toBe(RISK_LEVELS.HIGH);
      expect(getSkillRiskLevel('woodworking')).toBe(RISK_LEVELS.HIGH);
      expect(getSkillRiskLevel('electrical')).toBe(RISK_LEVELS.HIGH);
    });
  });
});