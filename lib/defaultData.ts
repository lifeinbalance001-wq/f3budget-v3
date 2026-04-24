/**
 * F3Budget V2 - 기본 데이터
 * 기본 카테고리, 계좌 타입 등을 정의합니다.
 */

import { Category, AccountType } from './types';

// ============================================================================
// 기본 지출 카테고리 (Copilot 기준)
// ============================================================================

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>[] = [
  { name: '식사', type: 'expense', icon: '🍽️', color: '#FB7185', isDefault: true, isActive: true },
  { name: '카페', type: 'expense', icon: '☕', color: '#F59E0B', isDefault: true, isActive: true },
  { name: '술/나이트라이프', type: 'expense', icon: '🍹', color: '#8B5CF6', isDefault: true, isActive: true },
  { name: '뷰티', type: 'expense', icon: '💄', color: '#EC4899', isDefault: true, isActive: true },
  { name: '자동차', type: 'expense', icon: '🚗', color: '#EF4444', isDefault: true, isActive: true },
  { name: '아이', type: 'expense', icon: '👶', color: '#F97316', isDefault: true, isActive: true },
  { name: '의류', type: 'expense', icon: '👕', color: '#06B6D4', isDefault: true, isActive: true },
  { name: '문화/여가', type: 'expense', icon: '💃', color: '#A855F7', isDefault: true, isActive: true },
  { name: '기부', type: 'expense', icon: '💛', color: '#FBBF24', isDefault: true, isActive: true },
  { name: '교육', type: 'expense', icon: '📚', color: '#3B82F6', isDefault: true, isActive: true },
  { name: '엔터테인먼트', type: 'expense', icon: '🎬', color: '#D946EF', isDefault: true, isActive: true },
  { name: '식료품', type: 'expense', icon: '🥑', color: '#10B981', isDefault: true, isActive: true },
  { name: '운동', type: 'expense', icon: '👟', color: '#14B8A6', isDefault: true, isActive: true },
  { name: '의료', type: 'expense', icon: '💊', color: '#F43F5E', isDefault: true, isActive: true },
  { name: '주거', type: 'expense', icon: '🏠', color: '#92400E', isDefault: true, isActive: true },
  { name: '보험', type: 'expense', icon: '☂️', color: '#7C3AED', isDefault: true, isActive: true },
  { name: '대출', type: 'expense', icon: '💰', color: '#059669', isDefault: true, isActive: true },
  { name: '개인관리', type: 'expense', icon: '✂️', color: '#DC2626', isDefault: true, isActive: true },
  { name: '반려동물', type: 'expense', icon: '🐕', color: '#B45309', isDefault: true, isActive: true },
  { name: '여행', type: 'expense', icon: '🎮', color: '#4F46E5', isDefault: true, isActive: true },
  { name: '임차료', type: 'expense', icon: '🔑', color: '#7C2D12', isDefault: true, isActive: true },
  { name: '기타', type: 'expense', icon: '📌', color: '#6B7280', isDefault: true, isActive: true },
];

// ============================================================================
// 기본 수입 카테고리
// ============================================================================

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>[] = [
  { name: '급여', type: 'income', icon: '💼', color: '#10B981', isDefault: true, isActive: true },
  { name: '보너스', type: 'income', icon: '🎁', color: '#FBBF24', isDefault: true, isActive: true },
  { name: '투자 수익', type: 'income', icon: '📈', color: '#3B82F6', isDefault: true, isActive: true },
  { name: '부업', type: 'income', icon: '💻', color: '#8B5CF6', isDefault: true, isActive: true },
  { name: '환급', type: 'income', icon: '💵', color: '#06B6D4', isDefault: true, isActive: true },
  { name: '기타 수입', type: 'income', icon: '📌', color: '#6B7280', isDefault: true, isActive: true },
];

// ============================================================================
// 계좌 타입별 아이콘 및 색상
// ============================================================================

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, { icon: string; color: string; label: string }> = {
  cash: { icon: '💵', color: '#10B981', label: '현금' },
  checking: { icon: '🏦', color: '#3B82F6', label: '입금통장' },
  savings: { icon: '🏦', color: '#06B6D4', label: '저축통장' },
  credit_card: { icon: '💳', color: '#F59E0B', label: '신용카드' },
  investment: { icon: '📈', color: '#8B5CF6', label: '투자' },
  real_estate: { icon: '🏠', color: '#92400E', label: '부동산' },
  other: { icon: '📌', color: '#6B7280', label: '기타' },
};

// ============================================================================
// 기본 계좌 (샘플)
// ============================================================================

export const DEFAULT_ACCOUNTS = [
  { name: '현금', type: 'cash' as AccountType, balance: 0 },
  { name: '입금통장', type: 'checking' as AccountType, balance: 0 },
  { name: '신용카드', type: 'credit_card' as AccountType, balance: 0 },
];

// ============================================================================
// 기본 목표 (샘플)
// ============================================================================

export const SAMPLE_GOALS = [
  {
    name: '비상금 모으기',
    description: '3개월치 생활비 저축',
    targetAmount: 3000000,
    icon: '🏦',
    color: '#3B82F6',
  },
  {
    name: '여행 자금',
    description: '해외 여행 계획',
    targetAmount: 5000000,
    icon: '✈️',
    color: '#06B6D4',
  },
  {
    name: '자기계발',
    description: '교육 및 강의 수강',
    targetAmount: 1000000,
    icon: '📚',
    color: '#8B5CF6',
  },
];

// ============================================================================
// 금융 칼럼 (학습 자료)
// ============================================================================

export const FINANCIAL_ARTICLES = [
  {
    id: '1',
    title: '월급쟁이도 할 수 있는 자산 관리법',
    excerpt: '급여만으로 자산을 늘리는 현실적인 방법을 알아봅시다.',
    category: '자산관리',
    readTime: 5,
  },
  {
    id: '2',
    title: '신용카드 현명하게 사용하기',
    excerpt: '신용카드의 혜택을 최대한 활용하면서 빚을 피하는 방법.',
    category: '신용관리',
    readTime: 4,
  },
  {
    id: '3',
    title: '목표 설정이 재무 성공의 열쇠',
    excerpt: '구체적인 재무 목표를 세우고 달성하는 방법.',
    category: '목표설정',
    readTime: 6,
  },
  {
    id: '4',
    title: '지출 패턴 분석으로 돈 새는 곳 찾기',
    excerpt: '당신의 지출 습관을 분석하고 개선하는 방법.',
    category: '지출관리',
    readTime: 5,
  },
  {
    id: '5',
    title: '부부가 함께하는 가계부 관리',
    excerpt: '가족 재무를 투명하게 관리하는 방법.',
    category: '가족재무',
    readTime: 7,
  },
];

// ============================================================================
// 유틸리티
// ============================================================================

export function getCategoryIcon(categoryName: string): string {
  const category = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES].find(
    (c) => c.name === categoryName
  );
  return category?.icon || '📌';
}

export function getCategoryColor(categoryName: string): string {
  const category = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES].find(
    (c) => c.name === categoryName
  );
  return category?.color || '#6B7280';
}

export function getAccountTypeConfig(type: AccountType) {
  return ACCOUNT_TYPE_CONFIG[type];
}
