/**
 * F3Budget V2 - 데이터 동기화 서비스
 * AsyncStorage와 서버 간 데이터 동기화
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as types from './types';

const STORAGE_KEYS = {
  HOUSEHOLD: 'f3budget:household',
  ACCOUNTS: 'f3budget:accounts',
  TRANSACTIONS: 'f3budget:transactions',
  CATEGORIES: 'f3budget:categories',
  GOALS: 'f3budget:goals',
  BUDGETS: 'f3budget:budgets',
  RECURRINGS: 'f3budget:recurrings',
  SYNC_METADATA: 'f3budget:sync_metadata',
  LAST_SYNC: 'f3budget:last_sync',
};

interface SyncMetadata {
  lastSync: string;
  pendingChanges: {
    transactions: string[];
    accounts: string[];
    goals: string[];
    budgets: string[];
    recurrings: string[];
  };
}

/**
 * 로컬 저장소에 데이터 저장
 */
export async function saveToLocalStorage<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    throw error;
  }
}

/**
 * 로컬 저장소에서 데이터 로드
 */
export async function loadFromLocalStorage<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return null;
  }
}

/**
 * 전체 데이터 저장
 */
export async function saveAllData(appState: {
  household: types.Household | null;
  accounts: types.Account[];
  transactions: types.Transaction[];
  categories: types.Category[];
  goals: types.Goal[];
  budgets: types.Budget[];
  recurrings: types.Recurring[];
}): Promise<void> {
  try {
    await Promise.all([
      saveToLocalStorage(STORAGE_KEYS.HOUSEHOLD, appState.household),
      saveToLocalStorage(STORAGE_KEYS.ACCOUNTS, appState.accounts),
      saveToLocalStorage(STORAGE_KEYS.TRANSACTIONS, appState.transactions),
      saveToLocalStorage(STORAGE_KEYS.CATEGORIES, appState.categories),
      saveToLocalStorage(STORAGE_KEYS.GOALS, appState.goals),
      saveToLocalStorage(STORAGE_KEYS.BUDGETS, appState.budgets),
      saveToLocalStorage(STORAGE_KEYS.RECURRINGS, appState.recurrings),
    ]);

    // 마지막 동기화 시간 업데이트
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save all data:', error);
    throw error;
  }
}

/**
 * 전체 데이터 로드
 */
export async function loadAllData(): Promise<{
  household: types.Household | null;
  accounts: types.Account[];
  transactions: types.Transaction[];
  categories: types.Category[];
  goals: types.Goal[];
  budgets: types.Budget[];
  recurrings: types.Recurring[];
}> {
  try {
    const [household, accounts, transactions, categories, goals, budgets, recurrings] =
      await Promise.all([
        loadFromLocalStorage<types.Household>(STORAGE_KEYS.HOUSEHOLD),
        loadFromLocalStorage<types.Account[]>(STORAGE_KEYS.ACCOUNTS),
        loadFromLocalStorage<types.Transaction[]>(STORAGE_KEYS.TRANSACTIONS),
        loadFromLocalStorage<types.Category[]>(STORAGE_KEYS.CATEGORIES),
        loadFromLocalStorage<types.Goal[]>(STORAGE_KEYS.GOALS),
        loadFromLocalStorage<types.Budget[]>(STORAGE_KEYS.BUDGETS),
        loadFromLocalStorage<types.Recurring[]>(STORAGE_KEYS.RECURRINGS),
      ]);

    return {
      household: household || null,
      accounts: accounts || [],
      transactions: transactions || [],
      categories: categories || [],
      goals: goals || [],
      budgets: budgets || [],
      recurrings: recurrings || [],
    };
  } catch (error) {
    console.error('Failed to load all data:', error);
    throw error;
  }
}

/**
 * 동기화 메타데이터 저장
 */
export async function saveSyncMetadata(metadata: SyncMetadata): Promise<void> {
  try {
    await saveToLocalStorage(STORAGE_KEYS.SYNC_METADATA, metadata);
  } catch (error) {
    console.error('Failed to save sync metadata:', error);
    throw error;
  }
}

/**
 * 동기화 메타데이터 로드
 */
export async function loadSyncMetadata(): Promise<SyncMetadata> {
  try {
    const metadata = await loadFromLocalStorage<SyncMetadata>(STORAGE_KEYS.SYNC_METADATA);
    return (
      metadata || {
        lastSync: new Date(0).toISOString(),
        pendingChanges: {
          transactions: [],
          accounts: [],
          goals: [],
          budgets: [],
          recurrings: [],
        },
      }
    );
  } catch (error) {
    console.error('Failed to load sync metadata:', error);
    return {
      lastSync: new Date(0).toISOString(),
      pendingChanges: {
        transactions: [],
        accounts: [],
        goals: [],
        budgets: [],
        recurrings: [],
      },
    };
  }
}

/**
 * 마지막 동기화 시간 가져오기
 */
export async function getLastSyncTime(): Promise<Date> {
  try {
    const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return lastSync ? new Date(lastSync) : new Date(0);
  } catch (error) {
    console.error('Failed to get last sync time:', error);
    return new Date(0);
  }
}

/**
 * 변경 사항 추적 (거래)
 */
export async function trackTransactionChange(transactionId: string): Promise<void> {
  try {
    const metadata = await loadSyncMetadata();
    if (!metadata.pendingChanges.transactions.includes(transactionId)) {
      metadata.pendingChanges.transactions.push(transactionId);
      await saveSyncMetadata(metadata);
    }
  } catch (error) {
    console.error('Failed to track transaction change:', error);
  }
}

/**
 * 변경 사항 추적 (계좌)
 */
export async function trackAccountChange(accountId: string): Promise<void> {
  try {
    const metadata = await loadSyncMetadata();
    if (!metadata.pendingChanges.accounts.includes(accountId)) {
      metadata.pendingChanges.accounts.push(accountId);
      await saveSyncMetadata(metadata);
    }
  } catch (error) {
    console.error('Failed to track account change:', error);
  }
}

/**
 * 변경 사항 추적 (목표)
 */
export async function trackGoalChange(goalId: string): Promise<void> {
  try {
    const metadata = await loadSyncMetadata();
    if (!metadata.pendingChanges.goals.includes(goalId)) {
      metadata.pendingChanges.goals.push(goalId);
      await saveSyncMetadata(metadata);
    }
  } catch (error) {
    console.error('Failed to track goal change:', error);
  }
}

/**
 * 변경 사항 초기화
 */
export async function clearPendingChanges(): Promise<void> {
  try {
    const metadata = await loadSyncMetadata();
    metadata.pendingChanges = {
      transactions: [],
      accounts: [],
      goals: [],
      budgets: [],
      recurrings: [],
    };
    metadata.lastSync = new Date().toISOString();
    await saveSyncMetadata(metadata);
  } catch (error) {
    console.error('Failed to clear pending changes:', error);
  }
}

/**
 * 서버와 동기화 (향후 구현)
 * 현재는 로컬 저장소만 사용
 */
export async function syncWithServer(
  appState: any,
  authToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: 서버 API 호출
    // const response = await fetch('https://api.f3budget.com/sync', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authToken}`,
    //   },
    //   body: JSON.stringify(appState),
    // });

    // if (!response.ok) {
    //   throw new Error(`Sync failed: ${response.statusText}`);
    // }

    // const data = await response.json();
    // await clearPendingChanges();
    // return { success: true };

    // 현재는 로컬 저장소만 업데이트
    await saveAllData(appState);
    await clearPendingChanges();
    return { success: true };
  } catch (error) {
    console.error('Failed to sync with server:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 데이터 초기화 (로그아웃 시)
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Failed to clear all data:', error);
    throw error;
  }
}
