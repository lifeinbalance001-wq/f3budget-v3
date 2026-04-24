/**
 * F3Budget V2 - 거래 API 클라이언트
 * 거래, 카테고리, 계좌 등의 API 호출
 */

import {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  CreateTransactionRequest,
  Category,
  Account,
  Goal,
  Budget,
  Recurring,
} from './types';
import { getToken } from './authApi';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// ============================================================================
// API 요청 헬퍼
// ============================================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// 거래 API
// ============================================================================

export async function getTransactions(
  householdId: string,
  params?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    accountId?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
  const queryParams = new URLSearchParams();
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params?.accountId) queryParams.append('accountId', params.accountId);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return apiRequest<PaginatedResponse<Transaction>>(
    `/households/${householdId}/transactions${query}`,
    { method: 'GET' }
  );
}

export async function createTransaction(
  householdId: string,
  request: CreateTransactionRequest
): Promise<ApiResponse<Transaction>> {
  return apiRequest<Transaction>(`/households/${householdId}/transactions`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function updateTransaction(
  householdId: string,
  transactionId: string,
  request: Partial<CreateTransactionRequest>
): Promise<ApiResponse<Transaction>> {
  return apiRequest<Transaction>(
    `/households/${householdId}/transactions/${transactionId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  );
}

export async function deleteTransaction(
  householdId: string,
  transactionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/transactions/${transactionId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// 카테고리 API
// ============================================================================

export async function getCategories(householdId: string): Promise<ApiResponse<Category[]>> {
  return apiRequest<Category[]>(`/households/${householdId}/categories`, {
    method: 'GET',
  });
}

export async function createCategory(
  householdId: string,
  category: Omit<Category, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Category>> {
  return apiRequest<Category>(`/households/${householdId}/categories`, {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(
  householdId: string,
  categoryId: string,
  category: Partial<Omit<Category, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Category>> {
  return apiRequest<Category>(`/households/${householdId}/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(
  householdId: string,
  categoryId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/categories/${categoryId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// 계좌 API
// ============================================================================

export async function getAccounts(householdId: string): Promise<ApiResponse<Account[]>> {
  return apiRequest<Account[]>(`/households/${householdId}/accounts`, {
    method: 'GET',
  });
}

export async function createAccount(
  householdId: string,
  account: Omit<Account, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Account>> {
  return apiRequest<Account>(`/households/${householdId}/accounts`, {
    method: 'POST',
    body: JSON.stringify(account),
  });
}

export async function updateAccount(
  householdId: string,
  accountId: string,
  account: Partial<Omit<Account, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Account>> {
  return apiRequest<Account>(`/households/${householdId}/accounts/${accountId}`, {
    method: 'PUT',
    body: JSON.stringify(account),
  });
}

export async function deleteAccount(
  householdId: string,
  accountId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/accounts/${accountId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// 목표 API
// ============================================================================

export async function getGoals(householdId: string): Promise<ApiResponse<Goal[]>> {
  return apiRequest<Goal[]>(`/households/${householdId}/goals`, {
    method: 'GET',
  });
}

export async function createGoal(
  householdId: string,
  goal: Omit<Goal, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Goal>> {
  return apiRequest<Goal>(`/households/${householdId}/goals`, {
    method: 'POST',
    body: JSON.stringify(goal),
  });
}

export async function updateGoal(
  householdId: string,
  goalId: string,
  goal: Partial<Omit<Goal, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Goal>> {
  return apiRequest<Goal>(`/households/${householdId}/goals/${goalId}`, {
    method: 'PUT',
    body: JSON.stringify(goal),
  });
}

export async function deleteGoal(
  householdId: string,
  goalId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/goals/${goalId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// 예산 API
// ============================================================================

export async function getBudgets(
  householdId: string,
  month?: string
): Promise<ApiResponse<Budget[]>> {
  const query = month ? `?month=${month}` : '';
  return apiRequest<Budget[]>(`/households/${householdId}/budgets${query}`, {
    method: 'GET',
  });
}

export async function createBudget(
  householdId: string,
  budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'spent'>
): Promise<ApiResponse<Budget>> {
  return apiRequest<Budget>(`/households/${householdId}/budgets`, {
    method: 'POST',
    body: JSON.stringify(budget),
  });
}

export async function updateBudget(
  householdId: string,
  budgetId: string,
  budget: Partial<Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Budget>> {
  return apiRequest<Budget>(`/households/${householdId}/budgets/${budgetId}`, {
    method: 'PUT',
    body: JSON.stringify(budget),
  });
}

export async function deleteBudget(
  householdId: string,
  budgetId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/budgets/${budgetId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// 반복 거래 API
// ============================================================================

export async function getRecurrings(householdId: string): Promise<ApiResponse<Recurring[]>> {
  return apiRequest<Recurring[]>(`/households/${householdId}/recurrings`, {
    method: 'GET',
  });
}

export async function createRecurring(
  householdId: string,
  recurring: Omit<Recurring, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Recurring>> {
  return apiRequest<Recurring>(`/households/${householdId}/recurrings`, {
    method: 'POST',
    body: JSON.stringify(recurring),
  });
}

export async function updateRecurring(
  householdId: string,
  recurringId: string,
  recurring: Partial<Omit<Recurring, 'id' | 'householdId' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Recurring>> {
  return apiRequest<Recurring>(`/households/${householdId}/recurrings/${recurringId}`, {
    method: 'PUT',
    body: JSON.stringify(recurring),
  });
}

export async function deleteRecurring(
  householdId: string,
  recurringId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/recurrings/${recurringId}`,
    { method: 'DELETE' }
  );
}

// ============================================================================
// 가계부 API
// ============================================================================

export async function getHouseholds(): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>('/households', {
    method: 'GET',
  });
}

export async function createHousehold(name: string): Promise<ApiResponse<any>> {
  return apiRequest<any>('/households', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function getHouseholdDetails(householdId: string): Promise<ApiResponse<any>> {
  return apiRequest<any>(`/households/${householdId}`, {
    method: 'GET',
  });
}
