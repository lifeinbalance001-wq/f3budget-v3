/**
 * F3Budget V2 - 유틸리티 함수
 * 금액 포맷, 날짜 포맷, ID 생성 등의 공통 함수
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// 클래스 유틸리티
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// 금액 포맷
// ============================================================================

export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseAmount(value: string): number {
  return parseInt(value.replace(/[^\d-]/g, ''), 10) || 0;
}

// ============================================================================
// 날짜 포맷
// ============================================================================

export function formatDate(date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'short') {
    return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  }

  if (format === 'long') {
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  return d.toLocaleDateString('ko-KR', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatMonth(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
}

export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getMonthString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getFirstDayOfMonth(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

export function getLastDayOfMonth(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
  return `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

export function isThisMonth(dateString: string): boolean {
  return dateString.startsWith(getMonthString());
}

export function daysUntil(targetDate: string): number {
  const today = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ============================================================================
// ID 생성
// ============================================================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// 배열 유틸리티
// ============================================================================

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function unique<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ============================================================================
// 숫자 유틸리티
// ============================================================================

export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function percentageOfTotal(value: number, total: number): string {
  return `${percentage(value, total)}%`;
}

export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============================================================================
// 검증 유틸리티
// ============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  // 최소 8자, 대문자, 소문자, 숫자 포함
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

// ============================================================================
// 텍스트 유틸리티
// ============================================================================

export function truncate(text: string, length: number = 50): string {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toKoreanNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}백만`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}만`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}천`;
  }
  return num.toString();
}

// ============================================================================
// 객체 유틸리티
// ============================================================================

export function omit<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
  const result = {} as Partial<T>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================================
// 디바운스 & 쓰로틀
// ============================================================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
