/**
 * Skills API integration for SkillShare MVP
 * Connects frontend to Phase 4 SkillShare APIs
 */

import { apiGet } from './api';

// Browse Skills API - GET /api/skills
export async function browseSkills({ category, search, popular = false } = {}) {
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (popular) params.append('popular', 'true');
  
  const queryString = params.toString();
  const path = queryString ? `/skills?${queryString}` : '/skills';
  
  try {
    const response = await apiGet(path);
    return {
      success: true,
      data: response.data,
      skills: response.data.skills || [],
      categories: response.data.categories || [],
      total: response.data.total || 0
    };
  } catch (error) {
    console.error('Browse skills error:', error);
    return {
      success: false,
      error: error.message,
      skills: [],
      categories: [],
      total: 0
    };
  }
}

// Skill Autocomplete API - GET /api/skills/suggestions/autocomplete
export async function getSkillSuggestions(query, limit = 10) {
  if (!query || query.length < 2) {
    return { success: true, suggestions: [] };
  }
  
  try {
    const response = await apiGet(`/skills/suggestions/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`);
    return {
      success: true,
      suggestions: response.data.suggestions || []
    };
  } catch (error) {
    console.error('Skill suggestions error:', error);
    return {
      success: false,
      error: error.message,
      suggestions: []
    };
  }
}

// AI Skill Matches API - GET /api/skills/matches/:userId
export async function getAiSkillMatches(userId, { limit = 10, minScore = 5 } = {}) {
  if (!userId) {
    return { success: false, error: 'User ID is required', matches: [] };
  }
  
  try {
    const response = await apiGet(`/skills/matches/${userId}?limit=${limit}&minScore=${minScore}`);
    return {
      success: true,
      data: response.data,
      matches: response.data.matches || [],
      targetUserId: response.data.targetUserId,
      algorithm: response.data.algorithm
    };
  } catch (error) {
    console.error('AI skill matches error:', error);
    return {
      success: false,
      error: error.message,
      matches: []
    };
  }
}

// Get Skill Details API - GET /api/skills/:skillName
export async function getSkillDetails(skillName) {
  if (!skillName) {
    return { success: false, error: 'Skill name is required' };
  }
  
  try {
    const response = await apiGet(`/skills/${encodeURIComponent(skillName)}`);
    return {
      success: true,
      data: response.data,
      skill: response.data.skill,
      category: response.data.category,
      teachers: response.data.teachers || [],
      learners: response.data.learners || [],
      totalTeachers: response.data.totalTeachers || 0,
      totalLearners: response.data.totalLearners || 0
    };
  } catch (error) {
    console.error('Skill details error:', error);
    return {
      success: false,
      error: error.message,
      teachers: [],
      learners: []
    };
  }
}

// Get Exchange Pairs API - GET /api/skills/exchange-pairs
export async function getSkillExchangePairs({ limit = 20, minScore = 10 } = {}) {
  try {
    const response = await apiGet(`/skills/exchange-pairs?limit=${limit}&minScore=${minScore}`);
    return {
      success: true,
      data: response.data,
      exchangePairs: response.data.exchangePairs || [],
      totalPairs: response.data.totalPairs || 0,
      algorithm: response.data.algorithm
    };
  } catch (error) {
    console.error('Exchange pairs error:', error);
    return {
      success: false,
      error: error.message,
      exchangePairs: []
    };
  }
}

// Convenience hook for skills API in React components
export function useSkillsApi() {
  return {
    browseSkills,
    getSkillSuggestions,
    getAiSkillMatches,
    getSkillDetails,
    getSkillExchangePairs
  };
}

// Skills search with caching for better performance
class SkillsCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  clear() {
    this.cache.clear();
  }
}

const skillsCache = new SkillsCache();

// Cached version of browse skills for better performance
export async function browseSkillsCached(params = {}) {
  const cacheKey = JSON.stringify(params);
  const cached = skillsCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const result = await browseSkills(params);
  if (result.success) {
    skillsCache.set(cacheKey, result);
  }
  
  return result;
}