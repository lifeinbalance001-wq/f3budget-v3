/**
 * F3Budget V2 - 로그인 화면
 */

import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/AppContext';
import { login } from '@/lib/authApi';
import { isValidEmail } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';

export default function LoginScreen() {
  const colors = useColors();
  const { setUser, setAuthenticated, setLoading, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const response = await login({ email, password });

    if (response.success && response.data) {
      setUser(response.data.user);
      setAuthenticated(true);
      router.replace('/(tabs)');
    } else {
      setErrorMessage(response.error || '로그인에 실패했습니다.');
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenContainer className="p-6" edges={['top', 'left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View className="gap-8">
            {/* 헤더 */}
            <View className="gap-2">
              <Text className="text-4xl font-bold text-foreground">F3Budget</Text>
              <Text className="text-base text-muted">목표 중심 개인재무 운영</Text>
            </View>

            {/* 에러 메시지 */}
            {error && (
              <View className="bg-error/10 border border-error rounded-lg p-3">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            )}

            {/* 입력 필드 */}
            <View className="gap-4">
              {/* 이메일 */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">이메일</Text>
                <TextInput
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="your@email.com"
                  placeholderTextColor={colors.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>

              {/* 비밀번호 */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">비밀번호</Text>
                <TextInput
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              className={`bg-primary rounded-lg py-3 items-center ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? '로그인 중...' : '로그인'}
              </Text>
            </TouchableOpacity>

            {/* 회원가입 링크 */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-muted">계정이 없으신가요?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text className="text-primary font-semibold">회원가입</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
