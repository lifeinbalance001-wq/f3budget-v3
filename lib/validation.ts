/**
 * F3Budget V2 - 유효성 검사 유틸리티
 */

/**
 * 이메일 유효성 검사
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 * - 최소 8자
 * - 대문자, 소문자, 숫자 포함
 */
export function isValidPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 최소 1개 포함해야 합니다');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 최소 1개 포함해야 합니다');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 최소 1개 포함해야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 이름 유효성 검사
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

/**
 * 금액 유효성 검사
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

/**
 * 날짜 유효성 검사
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 계좌명 유효성 검사
 */
export function isValidAccountName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 50;
}

/**
 * 카테고리명 유효성 검사
 */
export function isValidCategoryName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 30;
}

/**
 * 목표명 유효성 검사
 */
export function isValidGoalName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 50;
}

/**
 * 거래 유효성 검사
 */
export function validateTransaction(transaction: {
  type: string;
  amount: number;
  date: string;
  categoryId?: string;
  accountId?: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!['income', 'expense', 'transfer'].includes(transaction.type)) {
    errors.push('거래 유형이 올바르지 않습니다');
  }

  if (!isValidAmount(transaction.amount)) {
    errors.push('금액이 올바르지 않습니다');
  }

  if (!isValidDate(transaction.date)) {
    errors.push('날짜가 올바르지 않습니다');
  }

  if (transaction.type !== 'transfer' && !transaction.categoryId) {
    errors.push('카테고리를 선택해주세요');
  }

  if (!transaction.accountId) {
    errors.push('계좌를 선택해주세요');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 계좌 유효성 검사
 */
export function validateAccount(account: {
  name: string;
  type: string;
  balance: number;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidAccountName(account.name)) {
    errors.push('계좌명이 올바르지 않습니다');
  }

  if (!['checking', 'savings', 'cash', 'credit', 'investment', 'real-estate'].includes(account.type)) {
    errors.push('계좌 유형이 올바르지 않습니다');
  }

  if (!isValidAmount(account.balance)) {
    errors.push('잔액이 올바르지 않습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 목표 유효성 검사
 */
export function validateGoal(goal: {
  name: string;
  targetAmount: number;
  targetDate: string;
  priority: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidGoalName(goal.name)) {
    errors.push('목표명이 올바르지 않습니다');
  }

  if (!isValidAmount(goal.targetAmount)) {
    errors.push('목표 금액이 올바르지 않습니다');
  }

  if (!isValidDate(goal.targetDate)) {
    errors.push('목표 날짜가 올바르지 않습니다');
  }

  if (new Date(goal.targetDate) <= new Date()) {
    errors.push('목표 날짜는 오늘 이후여야 합니다');
  }

  if (!['high', 'medium', 'low'].includes(goal.priority)) {
    errors.push('우선순위가 올바르지 않습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 회원가입 폼 유효성 검사
 */
export function validateSignUp(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidName(data.name)) {
    errors.push('이름은 2자 이상 50자 이하여야 합니다');
  }

  if (!isValidEmail(data.email)) {
    errors.push('올바른 이메일 주소를 입력해주세요');
  }

  const passwordValidation = isValidPassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  }

  if (data.password !== data.confirmPassword) {
    errors.push('비밀번호가 일치하지 않습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 로그인 폼 유효성 검사
 */
export function validateLogin(data: {
  email: string;
  password: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isValidEmail(data.email)) {
    errors.push('올바른 이메일 주소를 입력해주세요');
  }

  if (!data.password || data.password.length === 0) {
    errors.push('비밀번호를 입력해주세요');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
