/**
 * F3Budget V2 - 전역 상태 관리
 * Context API + useReducer를 사용한 상태 관리
 */

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppAction, User, Household, Account, Category, Transaction, Recurring, Goal, Budget } from './types';

// ============================================================================
// Context 생성
// ============================================================================

const AppContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

// ============================================================================
// 초기 상태
// ============================================================================

const INITIAL_STATE: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentHousehold: null,
  households: [],
  accounts: [],
  categories: [],
  transactions: [],
  recurrings: [],
  goals: [],
  budgets: [],
  lastSyncTime: null,
  isSyncing: false,
};

// ============================================================================
// Reducer
// ============================================================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_CURRENT_HOUSEHOLD':
      return { ...state, currentHousehold: action.payload };

    case 'SET_HOUSEHOLDS':
      return { ...state, households: action.payload };

    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };

    case 'SET_RECURRINGS':
      return { ...state, recurrings: action.payload };

    case 'SET_GOALS':
      return { ...state, goals: action.payload };

    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case 'SET_LAST_SYNC_TIME':
      return { ...state, lastSyncTime: action.payload };

    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };

    case 'LOGOUT':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ============================================================================
// Provider Component
// ============================================================================

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // 상태를 AsyncStorage에 저장
  const persistState = useCallback(async () => {
    try {
      await AsyncStorage.setItem('appState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }, [state]);

  // 상태를 AsyncStorage에서 복원
  const restoreState = useCallback(async () => {
    try {
      const savedState = await AsyncStorage.getItem('appState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // 각 필드를 개별적으로 복원
        Object.keys(parsedState).forEach((key) => {
          dispatch({
            type: key.toUpperCase().replace(/_/g, '_') as any,
            payload: parsedState[key],
          });
        });
      }
    } catch (error) {
      console.error('Failed to restore state:', error);
    }
  }, []);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

// ============================================================================
// Custom Hooks
// ============================================================================

export function useAppState(): AppState {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}

export function useAuth() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setUser = useCallback(
    (user: User) => {
      dispatch({ type: 'SET_USER', payload: user });
    },
    [dispatch]
  );

  const setAuthenticated = useCallback(
    (isAuthenticated: boolean) => {
      dispatch({ type: 'SET_AUTHENTICATED', payload: isAuthenticated });
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (isLoading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: isLoading });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    setUser,
    setAuthenticated,
    setLoading,
    setError,
    logout,
  };
}

export function useHousehold() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setCurrentHousehold = useCallback(
    (household: Household) => {
      dispatch({ type: 'SET_CURRENT_HOUSEHOLD', payload: household });
    },
    [dispatch]
  );

  const setHouseholds = useCallback(
    (households: Household[]) => {
      dispatch({ type: 'SET_HOUSEHOLDS', payload: households });
    },
    [dispatch]
  );

  return {
    currentHousehold: state.currentHousehold,
    households: state.households,
    setCurrentHousehold,
    setHouseholds,
  };
}

export function useAccounts() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setAccounts = useCallback(
    (accounts: Account[]) => {
      dispatch({ type: 'SET_ACCOUNTS', payload: accounts });
    },
    [dispatch]
  );

  return {
    accounts: state.accounts,
    setAccounts,
  };
}

export function useCategories() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setCategories = useCallback(
    (categories: Category[]) => {
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    },
    [dispatch]
  );

  return {
    categories: state.categories,
    setCategories,
  };
}

export function useTransactions() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setTransactions = useCallback(
    (transactions: Transaction[]) => {
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
    },
    [dispatch]
  );

  const addTransaction = useCallback(
    (transaction: Transaction) => {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    },
    [dispatch]
  );

  const updateTransaction = useCallback(
    (transaction: Transaction) => {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
    },
    [dispatch]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    },
    [dispatch]
  );

  return {
    transactions: state.transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

export function useGoals() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setGoals = useCallback(
    (goals: Goal[]) => {
      dispatch({ type: 'SET_GOALS', payload: goals });
    },
    [dispatch]
  );

  return {
    goals: state.goals,
    setGoals,
  };
}

export function useBudgets() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setBudgets = useCallback(
    (budgets: Budget[]) => {
      dispatch({ type: 'SET_BUDGETS', payload: budgets });
    },
    [dispatch]
  );

  return {
    budgets: state.budgets,
    setBudgets,
  };
}

export function useSync() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const setLastSyncTime = useCallback(
    (time: string) => {
      dispatch({ type: 'SET_LAST_SYNC_TIME', payload: time });
    },
    [dispatch]
  );

  const setSyncing = useCallback(
    (isSyncing: boolean) => {
      dispatch({ type: 'SET_SYNCING', payload: isSyncing });
    },
    [dispatch]
  );

  return {
    lastSyncTime: state.lastSyncTime,
    isSyncing: state.isSyncing,
    setLastSyncTime,
    setSyncing,
  };
}
