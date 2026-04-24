/**
 * F3Budget V2 - 인증 API 클라이언트
 * 회원가입, 로그인, 토큰 갱신 등의 API 호출
 */

import { ApiResponse, User, AuthResponse, SignUpRequest, LoginRequest } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API 기본 URL (환경 변수에서 가져올 수 있음)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// ============================================================================
// 토큰 관리
// ============================================================================

const TOKEN_KEY = 'f3budget_token';
const REFRESH_TOKEN_KEY = 'f3budget_refresh_token';

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}

export async function saveToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}

export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save refresh token:', error);
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
}

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
// 인증 API
// ============================================================================

export async function signUp(request: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiRequest<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (response.success && response.data) {
    await saveToken(response.data.token);
    await saveRefreshToken(response.data.refreshToken);
  }

  return response;
}

export async function login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (response.success && response.data) {
    await saveToken(response.data.token);
    await saveRefreshToken(response.data.refreshToken);
  }

  return response;
}

export async function logout(): Promise<void> {
  await clearTokens();
}

export async function refreshAccessToken(): Promise<ApiResponse<AuthResponse>> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return {
      success: false,
      error: 'No refresh token available',
    };
  }

  const response = await apiRequest<AuthResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (response.success && response.data) {
    await saveToken(response.data.token);
    await saveRefreshToken(response.data.refreshToken);
  }

  return response;
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiRequest<User>('/auth/me', {
    method: 'GET',
  });
}

export async function updateProfile(name: string, avatar?: string): Promise<ApiResponse<User>> {
  return apiRequest<User>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ name, avatar }),
  });
}

// ============================================================================
// 비밀번호 관리
// ============================================================================

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function requestPasswordReset(email: string): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>('/auth/request-password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

// ============================================================================
// 가계부 공유 API
// ============================================================================

export async function createHouseholdInvite(householdId: string): Promise<ApiResponse<{ code: string }>> {
  return apiRequest<{ code: string }>('/households/invite', {
    method: 'POST',
    body: JSON.stringify({ householdId }),
  });
}

export async function joinHousehold(inviteCode: string): Promise<ApiResponse<{ householdId: string }>> {
  return apiRequest<{ householdId: string }>('/households/join', {
    method: 'POST',
    body: JSON.stringify({ inviteCode }),
  });
}

export async function leaveHousehold(householdId: string): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(`/households/${householdId}/leave`, {
    method: 'POST',
  });
}

export async function removeHouseholdMember(
  householdId: string,
  userId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    `/households/${householdId}/members/${userId}`,
    {
      method: 'DELETE',
    }
  );
}
