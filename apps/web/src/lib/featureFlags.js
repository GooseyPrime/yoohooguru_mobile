/**
 * Feature Flags Service
 * Manages feature flags on the frontend
 */

class FeatureFlagsService {
  constructor() {
    this.flags = {};
    this.loaded = false;
  }

  /**
   * Load feature flags from the API
   */
  async loadFlags() {
    try {
      const response = await fetch('/api/feature-flags', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.flags = data.flags || {};
        this.loaded = true;
        return this.flags;
      } else {
        console.warn('Failed to load feature flags, using defaults');
        this.flags = this.getDefaultFlags();
        this.loaded = true;
        return this.flags;
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
      this.flags = this.getDefaultFlags();
      this.loaded = true;
      return this.flags;
    }
  }

  /**
   * Get default feature flags (fallback)
   */
  getDefaultFlags() {
    return {
      booking: true,
      messaging: true,
      reviews: true,
      userProfiles: true,
      skillListing: true,
      communityEvents: false,
      certifications: false,
      orgTools: false,
      dataProducts: false,
      advancedAnalytics: false,
      realTimeChat: false,
      adminDashboard: true,
      systemReports: true,
      aiRecommendations: false,
      mobileApp: false,
      darkMode: false,
      internationalSupport: false,
      instantPayouts: false // disabled - not available in current account
    };
  }

  /**
   * Check if a feature is enabled
   * @param {string} flagName - The name of the feature flag
   * @returns {boolean} - Whether the feature is enabled
   */
  isEnabled(flagName) {
    if (!this.loaded) {
      console.warn(`Feature flag ${flagName} checked before flags were loaded`);
      return this.getDefaultFlags()[flagName] || false;
    }
    return this.flags[flagName] === true;
  }

  /**
   * Get all feature flags
   * @returns {object} - All feature flags
   */
  getAll() {
    if (!this.loaded) {
      return this.getDefaultFlags();
    }
    return { ...this.flags };
  }

  /**
   * Check if flags are loaded
   * @returns {boolean}
   */
  isLoaded() {
    return this.loaded;
  }
}

// Create a singleton instance
const featureFlags = new FeatureFlagsService();

export default featureFlags;