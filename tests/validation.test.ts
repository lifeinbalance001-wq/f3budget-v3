/**
 * F3Budget V2 - 유효성 검사 테스트
 */

import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAmount,
  isValidDate,
  isValidAccountName,
  isValidCategoryName,
  isValidGoalName,
  validateTransaction,
  validateAccount,
  validateGoal,
  validateSignUp,
  validateLogin,
} from '../lib/validation';

describe('Email Validation', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@example.co.kr')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid.email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
  });
});

describe('Password Validation', () => {
  it('should validate strong passwords', () => {
    const result = isValidPassword('SecurePass123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject weak passwords', () => {
    const result = isValidPassword('weak');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should require uppercase', () => {
    const result = isValidPassword('lowercase123');
    expect(result.errors).toContain('대문자를 최소 1개 포함해야 합니다');
  });

  it('should require lowercase', () => {
    const result = isValidPassword('UPPERCASE123');
    expect(result.errors).toContain('소문자를 최소 1개 포함해야 합니다');
  });

  it('should require numbers', () => {
    const result = isValidPassword('NoNumbers');
    expect(result.errors).toContain('숫자를 최소 1개 포함해야 합니다');
  });
});

describe('Name Validation', () => {
  it('should validate valid names', () => {
    expect(isValidName('John')).toBe(true);
    expect(isValidName('김철수')).toBe(true);
  });

  it('should reject short names', () => {
    expect(isValidName('A')).toBe(false);
  });

  it('should reject long names', () => {
    expect(isValidName('A'.repeat(51))).toBe(false);
  });
});

describe('Amount Validation', () => {
  it('should validate positive amounts', () => {
    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(0.01)).toBe(true);
  });

  it('should reject zero and negative amounts', () => {
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(-100)).toBe(false);
  });

  it('should reject non-finite numbers', () => {
    expect(isValidAmount(Infinity)).toBe(false);
    expect(isValidAmount(NaN)).toBe(false);
  });
});

describe('Date Validation', () => {
  it('should validate valid dates', () => {
    expect(isValidDate('2026-04-24')).toBe(true);
    expect(isValidDate('2026-12-31')).toBe(true);
  });

  it('should reject invalid dates', () => {
    expect(isValidDate('invalid-date')).toBe(false);
    expect(isValidDate('2026-13-01')).toBe(false);
  });
});

describe('Account Name Validation', () => {
  it('should validate valid account names', () => {
    expect(isValidAccountName('My Checking Account')).toBe(true);
    expect(isValidAccountName('신한 입출금')).toBe(true);
  });

  it('should reject empty names', () => {
    expect(isValidAccountName('')).toBe(false);
  });
});

describe('Category Name Validation', () => {
  it('should validate valid category names', () => {
    expect(isValidCategoryName('Food')).toBe(true);
    expect(isValidCategoryName('식료품')).toBe(true);
  });

  it('should reject long names', () => {
    expect(isValidCategoryName('A'.repeat(31))).toBe(false);
  });
});

describe('Goal Name Validation', () => {
  it('should validate valid goal names', () => {
    expect(isValidGoalName('Save for vacation')).toBe(true);
    expect(isValidGoalName('휴가 자금')).toBe(true);
  });
});

describe('Transaction Validation', () => {
  it('should validate valid transactions', () => {
    const result = validateTransaction({
      type: 'expense',
      amount: 50000,
      date: '2026-04-24',
      categoryId: 'cat-1',
      accountId: 'acc-1',
    });
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid transaction type', () => {
    const result = validateTransaction({
      type: 'invalid',
      amount: 50000,
      date: '2026-04-24',
      categoryId: 'cat-1',
      accountId: 'acc-1',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('거래 유형이 올바르지 않습니다');
  });

  it('should reject missing category for non-transfer', () => {
    const result = validateTransaction({
      type: 'expense',
      amount: 50000,
      date: '2026-04-24',
      accountId: 'acc-1',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('카테고리를 선택해주세요');
  });

  it('should allow transfer without category', () => {
    const result = validateTransaction({
      type: 'transfer',
      amount: 50000,
      date: '2026-04-24',
      accountId: 'acc-1',
    });
    expect(result.isValid).toBe(true);
  });
});

describe('Account Validation', () => {
  it('should validate valid accounts', () => {
    const result = validateAccount({
      name: 'My Account',
      type: 'checking',
      balance: 100000,
    });
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid account type', () => {
    const result = validateAccount({
      name: 'My Account',
      type: 'invalid',
      balance: 100000,
    });
    expect(result.isValid).toBe(false);
  });
});

describe('Goal Validation', () => {
  it('should validate valid goals', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
    const result = validateGoal({
      name: 'Save for vacation',
      targetAmount: 1000000,
      targetDate: futureDate.toISOString().split('T')[0],
      priority: 'high',
    });
    expect(result.isValid).toBe(true);
  });

  it('should reject past target dates', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    const result = validateGoal({
      name: 'Save for vacation',
      targetAmount: 1000000,
      targetDate: pastDate.toISOString().split('T')[0],
      priority: 'high',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('목표 날짜는 오늘 이후여야 합니다');
  });
});

describe('Sign Up Validation', () => {
  it('should validate complete sign up data', () => {
    const result = validateSignUp({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    });
    expect(result.isValid).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    const result = validateSignUp({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123',
      confirmPassword: 'DifferentPass123',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('비밀번호가 일치하지 않습니다');
  });
});

describe('Login Validation', () => {
  it('should validate complete login data', () => {
    const result = validateLogin({
      email: 'john@example.com',
      password: 'SecurePass123',
    });
    expect(result.isValid).toBe(true);
  });

  it('should reject empty password', () => {
    const result = validateLogin({
      email: 'john@example.com',
      password: '',
    });
    expect(result.isValid).toBe(false);
  });
});
