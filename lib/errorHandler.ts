/**
 * F3Budget V2 - 에러 처리 및 로깅 서비스
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

class ErrorHandler {
  private static readonly LOG_KEY = 'f3budget:error_logs';
  private static readonly MAX_LOGS = 100;

  /**
   * 에러 생성
   */
  static createError(
    type: ErrorType,
    message: string,
    code?: string,
    details?: any
  ): AppError {
    return {
      type,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 네트워크 에러
   */
  static networkError(message: string = '네트워크 연결을 확인해주세요'): AppError {
    return this.createError(ErrorType.NETWORK, message, 'NETWORK_ERROR');
  }

  /**
   * 인증 에러
   */
  static authError(message: string = '인증에 실패했습니다'): AppError {
    return this.createError(ErrorType.AUTH, message, 'AUTH_ERROR');
  }

  /**
   * 유효성 검사 에러
   */
  static validationError(message: string, details?: any): AppError {
    return this.createError(ErrorType.VALIDATION, message, 'VALIDATION_ERROR', details);
  }

  /**
   * 서버 에러
   */
  static serverError(message: string = '서버 오류가 발생했습니다'): AppError {
    return this.createError(ErrorType.SERVER, message, 'SERVER_ERROR');
  }

  /**
   * 알 수 없는 에러
   */
  static unknownError(error: any): AppError {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return this.createError(ErrorType.UNKNOWN, message, 'UNKNOWN_ERROR', error);
  }

  /**
   * 에러 로깅
   */
  static async logError(error: AppError): Promise<void> {
    try {
      const logs = await this.getLogs();
      logs.push(error);

      // 최대 로그 수 초과 시 오래된 항목 제거
      if (logs.length > this.MAX_LOGS) {
        logs.shift();
      }

      await AsyncStorage.setItem(this.LOG_KEY, JSON.stringify(logs));

      // 콘솔에도 출력
      console.error(`[${error.type}] ${error.message}`, error.details);
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  }

  /**
   * 에러 로그 조회
   */
  static async getLogs(): Promise<AppError[]> {
    try {
      const logs = await AsyncStorage.getItem(this.LOG_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (err) {
      console.error('Failed to get error logs:', err);
      return [];
    }
  }

  /**
   * 에러 로그 초기화
   */
  static async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.LOG_KEY);
    } catch (err) {
      console.error('Failed to clear error logs:', err);
    }
  }

  /**
   * 사용자 친화적 메시지 반환
   */
  static getUserMessage(error: AppError): string {
    const messages: Record<ErrorType, Record<string, string>> = {
      [ErrorType.NETWORK]: {
        NETWORK_ERROR: '네트워크 연결을 확인해주세요',
      },
      [ErrorType.AUTH]: {
        AUTH_ERROR: '인증에 실패했습니다. 다시 로그인해주세요',
      },
      [ErrorType.VALIDATION]: {
        VALIDATION_ERROR: '입력 정보를 확인해주세요',
      },
      [ErrorType.SERVER]: {
        SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
      },
      [ErrorType.UNKNOWN]: {
        UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
      },
    };

    return messages[error.type]?.[error.code || 'DEFAULT'] || error.message;
  }
}

export default ErrorHandler;
