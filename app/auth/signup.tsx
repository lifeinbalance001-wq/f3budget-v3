/**
 * F3Budget V2 - 회원가입 화면
 */

import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/lib/AppContext';
import { signUp } from '@/lib/authApi';
import { isValidEmail, isValidPassword } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';

export default function SignUpScreen() {
  const colors = useColors();
  const { setUser, setAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    // 유효성 검사
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage('비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    const response = await signUp({ email, password, name });

    if (response.success && response.data) {
      setUser(response.data.user);
      setAuthenticated(true);
      router.replace('/(tabs)');
    } else {
      setErrorMessage(response.error || '회원가입에 실패했습니다.');
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
              <Text className="text-base text-muted">계정 생성</Text>
            </View>

            {/* 에러 메시지 */}
            {error && (
              <View className="bg-error/10 border border-error rounded-lg p-3">
                <Text className="text-error text-sm">{error}</Text>
              </View>
            )}

            {/* 입력 필드 */}
            <View className="gap-4">
              {/* 이름 */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">이름</Text>
                <TextInput
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="홍길동"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>

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
                  placeholder="최소 8자, 대문자, 소문자, 숫자 포함"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>

              {/* 비밀번호 확인 */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">비밀번호 확인</Text>
                <TextInput
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              className={`bg-primary rounded-lg py-3 items-center ${isLoading ? 'opacity-50' : ''}`}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-base">
                {isLoading ? '계정 생성 중...' : '회원가입'}
              </Text>
            </TouchableOpacity>

            {/* 로그인 링크 */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-muted">이미 계정이 있으신가요?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-primary font-semibold">로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
