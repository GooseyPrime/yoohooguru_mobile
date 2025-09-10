/**
 * Users API service
 */

import { httpClient } from '../lib/http';
import { User, UserSearchParams, PaginatedResponse } from '../types';
import { 
  CreateUserInput, 
  UpdateUserInput, 
  UserSearchSchema,
  CreateUserSchema,
  UpdateUserSchema 
} from '../validators';

export class UsersApi {
  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return httpClient.get<{
      success: boolean;
      data: { user: User };
    }>('/users/me');
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string) {
    return httpClient.get<{
      success: boolean;
      data: { user: User };
    }>(`/users/${userId}`);
  }

  /**
   * Create user profile
   */
  async createUser(userData: CreateUserInput) {
    const validated = CreateUserSchema.parse(userData);
    return httpClient.post<{
      success: boolean;
      data: { user: User };
    }>('/users', validated);
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, userData: UpdateUserInput) {
    const validated = UpdateUserSchema.parse(userData);
    return httpClient.put<{
      success: boolean;
      data: { user: User };
    }>(`/users/${userId}`, validated);
  }

  /**
   * Search users with filters
   */
  async searchUsers(params: UserSearchParams = {}) {
    const validated = UserSearchSchema.parse(params);
    const searchParams = new URLSearchParams();
    
    Object.entries(validated).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return httpClient.get<PaginatedResponse<{
      users: User[];
    }>>(`/users/search?${searchParams}`);
  }

  /**
   * Get users offering a specific skill
   */
  async getUsersBySkill(skillName: string, options: {
    location?: string;
    radius?: number;
    page?: number;
    limit?: number;
  } = {}) {
    const params = new URLSearchParams({
      skill: skillName,
      ...Object.fromEntries(
        Object.entries(options).map(([k, v]) => [k, String(v)])
      )
    });

    return httpClient.get<PaginatedResponse<{
      users: User[];
    }>>(`/users/by-skill?${params}`);
  }

  /**
   * Get user's skill exchange history
   */
  async getUserExchanges(userId: string, options: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(options).map(([k, v]) => [k, String(v)])
      )
    );

    const queryString = params.toString();
    const path = queryString 
      ? `/users/${userId}/exchanges?${queryString}`
      : `/users/${userId}/exchanges`;

    return httpClient.get<PaginatedResponse<{
      exchanges: any[];
    }>>(path);
  }

  /**
   * Upload user avatar
   */
  async uploadAvatar(imageData: FormData) {
    return httpClient.request<{
      success: boolean;
      data: { photoURL: string };
    }>('/users/me/avatar', {
      method: 'POST',
      body: imageData,
      headers: {} // Let browser set Content-Type for FormData
    });
  }

  /**
   * Delete user account
   */
  async deleteUser() {
    return httpClient.delete<{
      success: boolean;
      message: string;
    }>('/users/me');
  }
}

export const usersApi = new UsersApi();