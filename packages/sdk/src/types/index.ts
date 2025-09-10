/**
 * Shared types for yoohoo.guru platform
 */

// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  location?: string;
  rating?: number;
  totalExchanges?: number;
  createdAt: string;
  updatedAt: string;
}

// Skill types
export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  teachersCount: number;
  learnersCount: number;
  popularityScore: number;
  createdAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  skillCount: number;
  color?: string;
  icon?: string;
}

// Exchange types
export interface SkillExchange {
  id: string;
  requesterId: string;
  providerId: string;
  skillOffered: string;
  skillRequested: string;
  status: ExchangeStatus;
  message?: string;
  scheduledAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ExchangeStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DECLINED = 'declined'
}

// Match types
export interface SkillMatch {
  userId: string;
  user: Pick<User, 'id' | 'displayName' | 'photoURL' | 'rating'>;
  skillOffered: string;
  skillRequested: string;
  matchScore: number;
  matchType: 'direct_match' | 'reverse_match' | 'category_match';
  distance?: number;
  lastActive?: string;
}

// Message types
export interface Message {
  id: string;
  exchangeId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  readAt?: string;
  createdAt: string;
}

export enum MessageType {
  TEXT = 'text',
  SYSTEM = 'system',
  SCHEDULE_PROPOSAL = 'schedule_proposal',
  EXCHANGE_REQUEST = 'exchange_request'
}

// Payment types
export interface Payment {
  id: string;
  exchangeId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search and filter types
export interface SkillSearchParams {
  query?: string;
  category?: string;
  location?: string;
  radius?: number;
  minRating?: number;
  sortBy?: 'relevance' | 'rating' | 'distance' | 'recent';
  page?: number;
  limit?: number;
}

export interface UserSearchParams {
  skills?: string[];
  location?: string;
  radius?: number;
  minRating?: number;
  availability?: 'available' | 'busy' | 'any';
  page?: number;
  limit?: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  readAt?: string;
  createdAt: string;
}

export enum NotificationType {
  EXCHANGE_REQUEST = 'exchange_request',
  EXCHANGE_ACCEPTED = 'exchange_accepted',
  EXCHANGE_DECLINED = 'exchange_declined',
  MESSAGE_RECEIVED = 'message_received',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_RECEIVED = 'review_received',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}