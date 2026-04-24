/**
 * F3Budget V2 - 설정 화면
 * 앱 설정 및 계정 관리
 */

import { ScrollView, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SettingsScreen() {
  const colors = useColors();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', onPress: () => {} },
      {
        text: '로그아웃',
        onPress: () => {
          // 로그아웃 로직
          router.replace('/auth/login');
        },
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', onPress: () => {} },
        {
          text: '삭제',
          onPress: () => {
            // 계정 삭제 로직
            router.replace('/auth/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!!onValueChange}
      className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-2"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
          <MaterialIcons name={icon as any} size={18} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{title}</Text>
          {subtitle && <Text className="text-xs text-muted mt-1">{subtitle}</Text>}
        </View>
      </View>
      {onValueChange !== undefined ? (
        <Switch
          value={value || false}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={value ? colors.primary : colors.muted}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8">
          <Text className="text-lg font-bold text-white">설정</Text>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 계정 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">계정</Text>
            <SettingItem
              icon="person"
              title="프로필"
              subtitle="이름, 이메일, 사진 변경"
              onPress={() => router.push('/profile')}
            />
            <SettingItem
              icon="lock"
              title="비밀번호"
              subtitle="비밀번호 변경"
              onPress={() => router.push('/change-password')}
            />
            <SettingItem
              icon="people"
              title="가계부 공유"
              subtitle="멤버 관리 및 초대"
              onPress={() => router.push('/household-share')}
            />
          </View>

          {/* 알림 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">알림</Text>
            <SettingItem
              icon="notifications"
              title="푸시 알림"
              subtitle="거래, 목표, 예산 알림"
              value={notifications}
              onValueChange={setNotifications}
            />
          </View>

          {/* 디스플레이 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">디스플레이</Text>
            <SettingItem
              icon="dark-mode"
              title="다크 모드"
              subtitle="시스템 설정에 따라"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>

          {/* 보안 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">보안</Text>
            <SettingItem
              icon="fingerprint"
              title="생체 인증"
              subtitle="지문 또는 얼굴 인식으로 로그인"
              value={biometric}
              onValueChange={setBiometric}
            />
          </View>

          {/* 동기화 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">동기화</Text>
            <SettingItem
              icon="cloud-sync"
              title="자동 동기화"
              subtitle="변경 사항 자동 저장"
              value={autoSync}
              onValueChange={setAutoSync}
            />
            <SettingItem
              icon="refresh"
              title="지금 동기화"
              subtitle="서버와 데이터 동기화"
              onPress={() => {
                // 동기화 로직
                Alert.alert('동기화', '데이터 동기화가 완료되었습니다.');
              }}
            />
          </View>

          {/* 정보 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">정보</Text>
            <SettingItem
              icon="info"
              title="앱 정보"
              subtitle="버전 0.1.0"
              onPress={() => {}}
            />
            <SettingItem
              icon="help"
              title="도움말 및 피드백"
              subtitle="문의사항이 있으신가요?"
              onPress={() => {}}
            />
            <SettingItem
              icon="description"
              title="이용약관"
              subtitle="서비스 약관 보기"
              onPress={() => {}}
            />
            <SettingItem
              icon="privacy-tip"
              title="개인정보 처리방침"
              subtitle="개인정보 정책 보기"
              onPress={() => {}}
            />
          </View>

          {/* 위험한 작업 섹션 */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-error">위험한 작업</Text>
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-2"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-lg bg-error/10 items-center justify-center">
                  <MaterialIcons name="logout" size={18} color="#FB7185" />
                </View>
                <Text className="text-sm font-semibold text-error">로그아웃</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="flex-row items-center justify-between bg-surface border border-error rounded-lg px-4 py-3"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <View className="w-10 h-10 rounded-lg bg-error/10 items-center justify-center">
                  <MaterialIcons name="delete-forever" size={18} color="#FB7185" />
                </View>
                <Text className="text-sm font-semibold text-error">계정 삭제</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* 버전 정보 */}
          <View className="items-center py-4 border-t border-border mt-4">
            <Text className="text-xs text-muted">F3Budget v0.1.0</Text>
            <Text className="text-xs text-muted">© 2026 F3Budget. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
