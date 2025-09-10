/**
 * Skills API service
 */

import { httpClient } from '../lib/http';
import { 
  Skill, 
  SkillCategory, 
  SkillMatch, 
  PaginatedResponse,
  SkillSearchParams 
} from '../types';
import { SkillSearchSchema } from '../validators';

export class SkillsApi {
  /**
   * Browse skills with optional filters
   */
  async browseSkills(params: SkillSearchParams = {}) {
    const validated = SkillSearchSchema.parse(params);
    const searchParams = new URLSearchParams();
    
    Object.entries(validated).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const path = queryString ? `/skills?${queryString}` : '/skills';
    
    return httpClient.get<PaginatedResponse<{
      skills: Skill[];
      categories: SkillCategory[];
    }>>(path);
  }

  /**
   * Get skill autocomplete suggestions
   */
  async getSkillSuggestions(query: string, limit = 10) {
    if (!query || query.length < 2) {
      return { success: true, data: { suggestions: [] } };
    }

    const params = new URLSearchParams({
      q: query,
      limit: String(limit)
    });

    return httpClient.get<{
      success: boolean;
      data: { suggestions: string[] };
    }>(`/skills/suggestions/autocomplete?${params}`);
  }

  /**
   * Get AI-powered skill matches for a user
   */
  async getSkillMatches(userId: string, options: {
    limit?: number;
    minScore?: number;
  } = {}) {
    const { limit = 10, minScore = 5 } = options;
    
    const params = new URLSearchParams({
      limit: String(limit),
      minScore: String(minScore)
    });

    return httpClient.get<{
      success: boolean;
      data: {
        matches: SkillMatch[];
        targetUserId: string;
        algorithm: string;
      };
    }>(`/skills/matches/${userId}?${params}`);
  }

  /**
   * Get detailed information about a specific skill
   */
  async getSkillDetails(skillName: string) {
    return httpClient.get<{
      success: boolean;
      data: {
        skill: Skill;
        category: SkillCategory;
        teachers: any[];
        learners: any[];
        totalTeachers: number;
        totalLearners: number;
      };
    }>(`/skills/${encodeURIComponent(skillName)}`);
  }

  /**
   * Get skill exchange pairs with compatibility scores
   */
  async getExchangePairs(options: {
    limit?: number;
    minScore?: number;
  } = {}) {
    const { limit = 20, minScore = 10 } = options;
    
    const params = new URLSearchParams({
      limit: String(limit),
      minScore: String(minScore)
    });

    return httpClient.get<{
      success: boolean;
      data: {
        exchangePairs: any[];
        totalPairs: number;
        algorithm: string;
      };
    }>(`/skills/exchange-pairs?${params}`);
  }

  /**
   * Get all skill categories
   */
  async getCategories() {
    return httpClient.get<{
      success: boolean;
      data: { categories: SkillCategory[] };
    }>('/skills/categories');
  }
}

export const skillsApi = new SkillsApi();