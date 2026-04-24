/**
 * F3Budget V2 - 전역 데이터 타입 정의
 * 모든 데이터 모델과 API 응답 타입을 정의합니다.
 */

// ============================================================================
// 사용자 & 인증
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================================================
// 가계부 & 공유
// ============================================================================

export interface Household {
  id: string;
  name: string;
  ownerId: string;
  members: HouseholdMember[];
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdMember {
  userId: string;
  user: User;
  role: 'owner' | 'member';
  joinedAt: string;
}

export interface HouseholdInvite {
  id: string;
  householdId: string;
  code: string;
  createdBy: string;
  expiresAt: string;
  usedAt?: string;
}

// ============================================================================
// 계좌 & 자산
// ============================================================================

export type AccountType = 'cash' | 'checking' | 'savings' | 'credit_card' | 'investment' | 'real_estate' | 'other';

export interface Account {
  id: string;
  householdId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 카테고리
// ============================================================================

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: string;
  householdId: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 거래
// ============================================================================

export interface Transaction {
  id: string;
  householdId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  categoryId?: string;
  category?: Category;
  accountId: string;
  account?: Account;
  toAccountId?: string;
  toAccount?: Account;
  date: string;
  memo?: string;
  attachments?: string[];
  isRecurring: boolean;
  recurringId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  date: string;
  memo?: string;
  isRecurring?: boolean;
  recurringId?: string;
}

// ============================================================================
// 반복 거래
// ============================================================================

export type RecurrenceFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Recurring {
  id: string;
  householdId: string;
  name: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  currency: string;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string;
  dayOfMonth?: number;
  dayOfWeek?: number;
  isActive: boolean;
  lastProcessedDate?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 목표
// ============================================================================

export interface Goal {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  category?: string;
  icon?: string;
  color?: string;
  startDate: string;
  targetDate: string;
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 예산
// ============================================================================

export interface Budget {
  id: string;
  householdId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  currency: string;
  month: string;
  spent: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API 응답 타입
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// 앱 상태 (Context)
// ============================================================================

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  currentHousehold: Household | null;
  households: Household[];
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  recurrings: Recurring[];
  goals: Goal[];
  budgets: Budget[];
  lastSyncTime: string | null;
  isSyncing: boolean;
}

export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_HOUSEHOLD'; payload: Household }
  | { type: 'SET_HOUSEHOLDS'; payload: Household[] }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_RECURRINGS'; payload: Recurring[] }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_LAST_SYNC_TIME'; payload: string }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'LOGOUT' };
