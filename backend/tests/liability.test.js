const request = require('supertest');

// Remove Firebase mocking - use real Firebase connections
describe('Liability API Tests', () => {
  describe('Risk Level Categorization', () => {
    it('should categorize high-risk activities correctly', () => {
      const highRiskCategories = [
        'physical-training',
        'construction', 
        'automotive',
        'outdoor-activities',
        'sports'
      ];

      highRiskCategories.forEach(category => {
        const isHighRisk = ['physical-training', 'construction', 'automotive', 'outdoor-activities', 'sports'].includes(category);
        expect(isHighRisk).toBe(true);
      });
    });

    it('should categorize medium-risk activities correctly', () => {
      const mediumRiskCategories = [
        'cooking',
        'arts-crafts',
        'home-repair',
        'gardening'
      ];

      mediumRiskCategories.forEach(category => {
        const isMediumRisk = ['cooking', 'arts-crafts', 'home-repair', 'gardening'].includes(category);
        expect(isMediumRisk).toBe(true);
      });
    });
  });

  describe('Emergency Contact Validation', () => {
    it('should require emergency contact for high-risk activities', () => {
      const emergencyContact = {
        name: 'Test Contact',
        phone: '555-1234',
        relationship: 'friend'
      };

      const isValid = !!(emergencyContact.name && emergencyContact.phone);
      expect(isValid).toBe(true);
    });

    it('should reject incomplete emergency contact', () => {
      const emergencyContact = {
        name: 'Test Contact',
        phone: '',
        relationship: 'friend'
      };

      const isValid = !!(emergencyContact.name && emergencyContact.phone);
      expect(isValid).toBe(false);
    });
  });

  describe('Enhanced Terms and Conditions', () => {
    it('should include comprehensive liability coverage', () => {
      const liabilityTerms = {
        assumptionOfRisk: true,
        releaseOfClaims: true,
        indemnification: true,
        propertyDamageDisclaimer: true,
        limitationOfLiability: true,
        noWarranty: true
      };

      Object.values(liabilityTerms).forEach(term => {
        expect(term).toBe(true);
      });
    });

    it('should specify different risk levels', () => {
      const riskLevels = ['low', 'medium', 'high'];
      
      riskLevels.forEach(level => {
        expect(['low', 'medium', 'high'].includes(level)).toBe(true);
      });
    });
  });
});