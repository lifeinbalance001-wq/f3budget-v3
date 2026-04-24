/**
 * F3Budget V2 - 가계부 공유 화면
 * 가계부를 다른 사용자와 공유하고 관리
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockHousehold } from '@/lib/mockData';

interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
  joinedDate: string;
  avatar?: string;
}

const SAMPLE_MEMBERS: HouseholdMember[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    role: 'owner',
    joinedDate: '2026-01-15',
    avatar: '👨',
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    role: 'member',
    joinedDate: '2026-02-20',
    avatar: '👩',
  },
];

export default function HouseholdShareScreen() {
  const colors = useColors();
  const [members, setMembers] = useState<HouseholdMember[]>(SAMPLE_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedMember, setSelectedMember] = useState<HouseholdMember | null>(null);

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      // 초대 로직
      console.log('초대:', inviteEmail);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-4">
          <Text className="text-lg font-bold text-white">가계부 공유</Text>
          <Text className="text-sm text-white/70">
            {mockHousehold.name}
          </Text>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 공유 코드 섹션 */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-3">
            <Text className="text-sm font-semibold text-foreground">공유 코드</Text>
            <Text className="text-xs text-muted mb-2">
              이 코드를 다른 사용자와 공유하면 가계부에 참여할 수 있습니다
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 bg-surface2 rounded-lg px-3 py-3">
                <Text className="text-base font-bold text-foreground font-mono">
                  HH-2026-ABC123
                </Text>
              </View>
              <TouchableOpacity className="w-12 h-12 rounded-lg bg-primary items-center justify-center">
                <MaterialIcons name="content-copy" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 멤버 섹션 */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">
                멤버 ({members.length})
              </Text>
              <TouchableOpacity
                onPress={() => setShowInviteModal(true)}
                className="flex-row items-center gap-1 bg-primary px-3 py-2 rounded-lg"
              >
                <MaterialIcons name="add" size={16} color="white" />
                <Text className="text-xs font-bold text-white">초대</Text>
              </TouchableOpacity>
            </View>

            {/* 멤버 리스트 */}
            <FlatList
              data={members}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedMember(item)}
                  className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-2"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                      <Text className="text-lg">{item.avatar}</Text>
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-foreground">
                          {item.name}
                        </Text>
                        {item.role === 'owner' && (
                          <View className="bg-primary/20 px-2 py-0.5 rounded">
                            <Text className="text-xs font-bold text-primary">
                              관리자
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-muted">{item.email}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-muted">
                      {new Date(item.joinedDate).toLocaleDateString('ko-KR', {
                        year: '2-digit',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                    {item.role !== 'owner' && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(item.id)}
                        className="w-8 h-8 rounded items-center justify-center"
                      >
                        <MaterialIcons name="more-vert" size={18} color={colors.muted} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* 공유 설정 */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-4">
            <Text className="text-sm font-semibold text-foreground">공유 설정</Text>

            {/* 권한 설정 */}
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-foreground">멤버 초대</Text>
                  <Text className="text-xs text-muted">모든 멤버가 초대 가능</Text>
                </View>
                <View className="w-12 h-7 rounded-full bg-primary/20 items-center justify-end pr-1">
                  <View className="w-6 h-6 rounded-full bg-primary" />
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-foreground">거래 추가/수정</Text>
                  <Text className="text-xs text-muted">모든 멤버가 가능</Text>
                </View>
                <View className="w-12 h-7 rounded-full bg-primary/20 items-center justify-end pr-1">
                  <View className="w-6 h-6 rounded-full bg-primary" />
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-foreground">목표 수정</Text>
                  <Text className="text-xs text-muted">관리자만 가능</Text>
                </View>
                <View className="w-12 h-7 rounded-full bg-border items-center justify-start pl-1">
                  <View className="w-6 h-6 rounded-full bg-border" />
                </View>
              </View>
            </View>
          </View>

          {/* 공유 해제 */}
          <TouchableOpacity className="border border-error rounded-lg py-4 items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="link-off" size={20} color="#FB7185" />
              <Text className="text-error font-bold text-base">공유 해제</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 초대 모달 */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-4">
          <View className="bg-background rounded-lg p-6 w-full max-w-sm gap-4">
            <View className="gap-2">
              <Text className="text-lg font-bold text-foreground">멤버 초대</Text>
              <Text className="text-sm text-muted">
                초대할 사용자의 이메일을 입력하세요
              </Text>
            </View>

            <TextInput
              placeholder="example@email.com"
              placeholderTextColor={colors.muted}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowInviteModal(false)}
                className="flex-1 border border-border rounded-lg py-3 items-center"
              >
                <Text className="text-foreground font-semibold">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleInvite}
                className="flex-1 bg-primary rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">초대</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
