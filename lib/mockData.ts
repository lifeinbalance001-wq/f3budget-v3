/**
 * F3Budget V2 - 로컬 테스트용 샘플 데이터
 */

import { User, Household, Account, Category, Transaction, Goal, Budget, Recurring } from './types';
import { generateId } from './utils';

// 현재 날짜 기준
const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const currentDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

// ============================================================================
// 사용자
// ============================================================================

export const mockUser: User = {
  id: generateId(),
  email: 'user@example.com',
  name: '홍길동',
  avatar: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================================
// 가계부
// ============================================================================

export const mockHousehold: Household = {
  id: generateId(),
  name: '우리 가계부',
  description: '홍길동과 김영희의 공동 가계부',
  currency: 'KRW',
  members: [
    {
      userId: mockUser.id,
      name: mockUser.name,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    },
  ],
  createdBy: mockUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================================================
// 계좌
// ============================================================================

export const mockAccounts: Account[] = [
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '신한 입출금',
    type: 'checking',
    bank: '신한은행',
    balance: 2500000,
    currency: 'KRW',
    icon: '🏦',
    color: '#3B82F6',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '현금',
    type: 'cash',
    bank: undefined,
    balance: 150000,
    currency: 'KRW',
    icon: '💵',
    color: '#10B981',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '신용카드',
    type: 'credit',
    bank: '삼성카드',
    balance: -450000,
    currency: 'KRW',
    icon: '💳',
    color: '#F59E0B',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '투자 계좌',
    type: 'investment',
    bank: '미래에셋',
    balance: 5000000,
    currency: 'KRW',
    icon: '📈',
    color: '#8B5CF6',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// 카테고리
// ============================================================================

export const mockCategories: Category[] = [
  // 지출 카테고리
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '식비',
    type: 'expense',
    icon: '🍽️',
    color: '#EF4444',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '카페',
    type: 'expense',
    icon: '☕',
    color: '#F97316',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '교통',
    type: 'expense',
    icon: '🚗',
    color: '#06B6D4',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '쇼핑',
    type: 'expense',
    icon: '🛍️',
    color: '#EC4899',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '의료',
    type: 'expense',
    icon: '💊',
    color: '#EF4444',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '엔터테인먼트',
    type: 'expense',
    icon: '🎬',
    color: '#8B5CF6',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // 수입 카테고리
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '급여',
    type: 'income',
    icon: '💰',
    color: '#10B981',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '보너스',
    type: 'income',
    icon: '🎁',
    color: '#06B6D4',
    isCustom: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// 거래
// ============================================================================

export const mockTransactions: Transaction[] = [
  {
    id: generateId(),
    householdId: mockHousehold.id,
    type: 'expense',
    amount: 45000,
    currency: 'KRW',
    categoryId: mockCategories[0].id, // 식비
    accountId: mockAccounts[0].id, // 신한 입출금
    date: currentDay,
    memo: '점심 식사',
    isRecurring: false,
    createdBy: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    type: 'expense',
    amount: 5500,
    currency: 'KRW',
    categoryId: mockCategories[1].id, // 카페
    accountId: mockAccounts[1].id, // 현금
    date: currentDay,
    memo: '아메리카노',
    isRecurring: false,
    createdBy: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    type: 'expense',
    amount: 2500,
    currency: 'KRW',
    categoryId: mockCategories[2].id, // 교통
    accountId: mockAccounts[0].id, // 신한 입출금
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() - 1).padStart(2, '0')}`,
    memo: '지하철 정기권',
    isRecurring: false,
    createdBy: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    type: 'expense',
    amount: 120000,
    currency: 'KRW',
    categoryId: mockCategories[3].id, // 쇼핑
    accountId: mockAccounts[2].id, // 신용카드
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() - 2).padStart(2, '0')}`,
    memo: '옷 구매',
    isRecurring: false,
    createdBy: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    type: 'income',
    amount: 3000000,
    currency: 'KRW',
    categoryId: mockCategories[6].id, // 급여
    accountId: mockAccounts[0].id, // 신한 입출금
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`,
    memo: '월급',
    isRecurring: false,
    createdBy: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// 목표
// ============================================================================

export const mockGoals: Goal[] = [
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '여름 휴가 자금',
    description: '가족과 함께 해외 여행',
    targetAmount: 5000000,
    currentAmount: 2500000,
    targetDate: '2026-08-31',
    category: 'travel',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '긴급 자금',
    description: '예상치 못한 상황에 대비',
    targetAmount: 3000000,
    currentAmount: 1500000,
    targetDate: '2026-12-31',
    category: 'emergency',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '새 노트북 구매',
    description: '업무용 노트북',
    targetAmount: 2000000,
    currentAmount: 800000,
    targetDate: '2026-06-30',
    category: 'electronics',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// 예산
// ============================================================================

export const mockBudgets: Budget[] = [
  {
    id: generateId(),
    householdId: mockHousehold.id,
    categoryId: mockCategories[0].id, // 식비
    month: currentMonth,
    amount: 500000,
    spent: 245000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    categoryId: mockCategories[1].id, // 카페
    month: currentMonth,
    amount: 50000,
    spent: 16500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    categoryId: mockCategories[2].id, // 교통
    month: currentMonth,
    amount: 100000,
    spent: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    categoryId: mockCategories[3].id, // 쇼핑
    month: currentMonth,
    amount: 300000,
    spent: 120000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================================
// 반복 거래
// ============================================================================

export const mockRecurrings: Recurring[] = [
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '월세',
    type: 'expense',
    amount: 1500000,
    currency: 'KRW',
    categoryId: mockCategories[0].id,
    accountId: mockAccounts[0].id,
    frequency: 'monthly',
    dayOfMonth: 1,
    startDate: '2026-01-01',
    endDate: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    householdId: mockHousehold.id,
    name: '통신비',
    type: 'expense',
    amount: 50000,
    currency: 'KRW',
    categoryId: mockCategories[2].id,
    accountId: mockAccounts[0].id,
    frequency: 'monthly',
    dayOfMonth: 15,
    startDate: '2026-01-15',
    endDate: undefined,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
