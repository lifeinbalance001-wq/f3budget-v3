/**
 * F3Budget V2 - 성능 최적화 유틸리티
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * 디바운스 함수
 * 마지막 호출 후 일정 시간이 지나야 실행
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쓰로틀 함수
 * 일정 시간 간격으로만 실행
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 메모이제이션 훅
 * 의존성이 변경되지 않으면 이전 값 반환
 */
export function useMemoized<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps);
}

/**
 * 콜백 메모이제이션 훅
 * 의존성이 변경되지 않으면 이전 함수 반환
 */
export function useCallbackMemoized<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps) as T;
}

/**
 * 이전 값 추적 훅
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * 배열 페이지네이션
 */
export function paginate<T>(array: T[], pageSize: number, pageNumber: number): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

/**
 * 배열 청킹
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 성능 측정
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  static measure(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`Mark "${name}" not found`);
      return 0;
    }

    const duration = performance.now() - startTime;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    this.marks.delete(name);

    return duration;
  }

  static clear(): void {
    this.marks.clear();
  }
}

/**
 * 메모리 효율적인 리스트 렌더링
 * 가상 스크롤링 대체 (간단한 구현)
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  scrollOffset: number
) {
  const startIndex = Math.floor(scrollOffset / itemHeight);
  const endIndex = Math.ceil((scrollOffset + containerHeight) / itemHeight);

  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
  };
}

/**
 * 캐시 구현
 */
export class Cache<K, V> {
  private cache: Map<K, { value: V; timestamp: number }> = new Map();
  private readonly ttl: number; // Time to live in milliseconds

  constructor(ttl: number = 5 * 60 * 1000) {
    // 기본 5분
    this.ttl = ttl;
  }

  set(key: K, value: V): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: K): V | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // TTL 확인
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: K): boolean {
    return this.get(key) !== null;
  }

  delete(key: K): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * 요청 중복 제거 (Request Deduplication)
 */
export class RequestDeduplicator {
  private pending: Map<string, Promise<any>> = new Map();

  async execute<T>(
    key: string,
    fn: () => Promise<T>
  ): Promise<T> {
    // 이미 진행 중인 요청이 있으면 재사용
    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    // 새 요청 시작
    const promise = fn()
      .then((result) => {
        this.pending.delete(key);
        return result;
      })
      .catch((error) => {
        this.pending.delete(key);
        throw error;
      });

    this.pending.set(key, promise);
    return promise;
  }

  clear(): void {
    this.pending.clear();
  }
}

/**
 * 배치 업데이트
 * 여러 업데이트를 한 번에 처리
 */
export class BatchUpdater<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly batchSize: number;
  private readonly batchDelay: number;
  private readonly onBatch: (items: T[]) => void;

  constructor(
    onBatch: (items: T[]) => void,
    batchSize: number = 10,
    batchDelay: number = 100
  ) {
    this.onBatch = onBatch;
    this.batchSize = batchSize;
    this.batchDelay = batchDelay;
  }

  add(item: T): void {
    this.queue.push(item);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchDelay);
    }
  }

  flush(): void {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    this.onBatch(batch);

    if (this.queue.length > 0) {
      this.timer = setTimeout(() => this.flush(), this.batchDelay);
    } else if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  clear(): void {
    this.queue = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
