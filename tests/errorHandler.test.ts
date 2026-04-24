/**
 * F3Budget V2 - 에러 처리 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ErrorHandler, { ErrorType } from '../lib/errorHandler';

describe('ErrorHandler', () => {
  beforeEach(async () => {
    // 각 테스트 전에 로그 초기화
    await ErrorHandler.clearLogs();
  });

  afterEach(async () => {
    // 각 테스트 후에 로그 초기화
    await ErrorHandler.clearLogs();
  });

  describe('Error Creation', () => {
    it('should create network error', () => {
      const error = ErrorHandler.networkError();
      expect(error.type).toBe(ErrorType.NETWORK);
      expect(error.message).toBe('네트워크 연결을 확인해주세요');
    });

    it('should create auth error', () => {
      const error = ErrorHandler.authError();
      expect(error.type).toBe(ErrorType.AUTH);
      expect(error.message).toBe('인증에 실패했습니다');
    });

    it('should create validation error', () => {
      const error = ErrorHandler.validationError('Invalid input', { field: 'email' });
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.message).toBe('Invalid input');
      expect(error.details).toEqual({ field: 'email' });
    });

    it('should create server error', () => {
      const error = ErrorHandler.serverError();
      expect(error.type).toBe(ErrorType.SERVER);
      expect(error.message).toBe('서버 오류가 발생했습니다');
    });

    it('should create unknown error', () => {
      const originalError = new Error('Something went wrong');
      const error = ErrorHandler.unknownError(originalError);
      expect(error.type).toBe(ErrorType.UNKNOWN);
      expect(error.message).toBe('Something went wrong');
    });
  });

  describe('Error Logging', () => {
    it('should log errors', async () => {
      const error = ErrorHandler.networkError();
      await ErrorHandler.logError(error);

      const logs = await ErrorHandler.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe(ErrorType.NETWORK);
    });

    it('should maintain multiple error logs', async () => {
      const error1 = ErrorHandler.networkError();
      const error2 = ErrorHandler.authError();
      const error3 = ErrorHandler.serverError();

      await ErrorHandler.logError(error1);
      await ErrorHandler.logError(error2);
      await ErrorHandler.logError(error3);

      const logs = await ErrorHandler.getLogs();
      expect(logs).toHaveLength(3);
    });

    it('should clear logs', async () => {
      const error = ErrorHandler.networkError();
      await ErrorHandler.logError(error);

      let logs = await ErrorHandler.getLogs();
      expect(logs).toHaveLength(1);

      await ErrorHandler.clearLogs();
      logs = await ErrorHandler.getLogs();
      expect(logs).toHaveLength(0);
    });
  });

  describe('User Messages', () => {
    it('should return user-friendly network error message', () => {
      const error = ErrorHandler.networkError();
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('네트워크 연결을 확인해주세요');
    });

    it('should return user-friendly auth error message', () => {
      const error = ErrorHandler.authError();
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('인증에 실패했습니다. 다시 로그인해주세요');
    });

    it('should return user-friendly validation error message', () => {
      const error = ErrorHandler.validationError('Invalid input');
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('입력 정보를 확인해주세요');
    });

    it('should return user-friendly server error message', () => {
      const error = ErrorHandler.serverError();
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
    });

    it('should return original message for unknown error', () => {
      const error = ErrorHandler.createError(
        ErrorType.UNKNOWN,
        'Custom error message'
      );
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('Custom error message');
    });
  });

  describe('Error Timestamps', () => {
    it('should include timestamp in error', () => {
      const error = ErrorHandler.networkError();
      expect(error.timestamp).toBeDefined();
      expect(error.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should have valid ISO timestamp', () => {
      const error = ErrorHandler.networkError();
      const date = new Date(error.timestamp);
      expect(date instanceof Date).toBe(true);
      expect(!isNaN(date.getTime())).toBe(true);
    });
  });

  describe('Error Details', () => {
    it('should preserve error details', () => {
      const details = { field: 'email', value: 'invalid' };
      const error = ErrorHandler.validationError('Invalid email', details);
      expect(error.details).toEqual(details);
    });

    it('should handle complex error details', () => {
      const details = {
        errors: [
          { field: 'email', message: 'Invalid format' },
          { field: 'password', message: 'Too short' },
        ],
      };
      const error = ErrorHandler.validationError('Validation failed', details);
      expect(error.details).toEqual(details);
    });
  });
});
