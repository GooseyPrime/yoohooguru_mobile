/**
 * Zod schemas for request/response validation
 */

import { z } from 'zod';
import { ExchangeStatus, MessageType, PaymentStatus, NotificationType } from '../types';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  skillsOffered: z.array(z.string()),
  skillsWanted: z.array(z.string()),
  location: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  totalExchanges: z.number().min(0).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional(),
  skillsOffered: z.array(z.string()).max(20),
  skillsWanted: z.array(z.string()).max(20),
  location: z.string().max(100).optional()
});

export const UpdateUserSchema = CreateUserSchema.partial();

// Skill schemas
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  teachersCount: z.number().min(0),
  learnersCount: z.number().min(0),
  popularityScore: z.number().min(0),
  createdAt: z.string()
});

export const SkillCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  skillCount: z.number().min(0),
  color: z.string().optional(),
  icon: z.string().optional()
});

// Exchange schemas
export const ExchangeStatusSchema = z.nativeEnum(ExchangeStatus);

export const SkillExchangeSchema = z.object({
  id: z.string(),
  requesterId: z.string(),
  providerId: z.string(),
  skillOffered: z.string(),
  skillRequested: z.string(),
  status: ExchangeStatusSchema,
  message: z.string().max(1000).optional(),
  scheduledAt: z.string().optional(),
  completedAt: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().max(500).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const CreateExchangeSchema = z.object({
  providerId: z.string(),
  skillOffered: z.string().min(2).max(100),
  skillRequested: z.string().min(2).max(100),
  message: z.string().max(1000).optional()
});

export const UpdateExchangeSchema = z.object({
  status: ExchangeStatusSchema.optional(),
  message: z.string().max(1000).optional(),
  scheduledAt: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  review: z.string().max(500).optional()
});

// Match schemas
export const SkillMatchSchema = z.object({
  userId: z.string(),
  user: z.object({
    id: z.string(),
    displayName: z.string().optional(),
    photoURL: z.string().optional(),
    rating: z.number().optional()
  }),
  skillOffered: z.string(),
  skillRequested: z.string(),
  matchScore: z.number().min(0),
  matchType: z.enum(['direct_match', 'reverse_match', 'category_match']),
  distance: z.number().min(0).optional(),
  lastActive: z.string().optional()
});

// Message schemas
export const MessageTypeSchema = z.nativeEnum(MessageType);

export const MessageSchema = z.object({
  id: z.string(),
  exchangeId: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  content: z.string().max(2000),
  type: MessageTypeSchema,
  readAt: z.string().optional(),
  createdAt: z.string()
});

export const CreateMessageSchema = z.object({
  exchangeId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1).max(2000),
  type: MessageTypeSchema.optional().default(MessageType.TEXT)
});

// Payment schemas
export const PaymentStatusSchema = z.nativeEnum(PaymentStatus);

export const PaymentSchema = z.object({
  id: z.string(),
  exchangeId: z.string(),
  payerId: z.string(),
  receiverId: z.string(),
  amount: z.number().min(0),
  currency: z.string().length(3),
  status: PaymentStatusSchema,
  stripePaymentIntentId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  completedAt: z.string().optional()
});

export const CreatePaymentSchema = z.object({
  exchangeId: z.string(),
  amount: z.number().min(0.5), // Minimum $0.50
  currency: z.string().length(3).default('USD'),
  metadata: z.record(z.any()).optional()
});

// Search schemas
export const SkillSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  radius: z.number().min(1).max(100).optional(),
  minRating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(['relevance', 'rating', 'distance', 'recent']).optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20)
});

export const UserSearchSchema = z.object({
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  radius: z.number().min(1).max(100).optional(),
  minRating: z.number().min(0).max(5).optional(),
  availability: z.enum(['available', 'busy', 'any']).optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20)
});

// Notification schemas
export const NotificationTypeSchema = z.nativeEnum(NotificationType);

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: NotificationTypeSchema,
  title: z.string().max(100),
  message: z.string().max(500),
  data: z.record(z.any()).optional(),
  readAt: z.string().optional(),
  createdAt: z.string()
});

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export const PaginatedResponseSchema = ApiResponseSchema.extend({
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }).optional()
});

// Export inferred types
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateExchangeInput = z.infer<typeof CreateExchangeSchema>;
export type UpdateExchangeInput = z.infer<typeof UpdateExchangeSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type SkillSearchInput = z.infer<typeof SkillSearchSchema>;
export type UserSearchInput = z.infer<typeof UserSearchSchema>;