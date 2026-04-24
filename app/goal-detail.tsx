/**
 * F3Budget V2 - 목표 상세 화면
 * 목표 중심 재무 운영 허브
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockGoals } from '@/lib/mockData';

const PRIORITY_COLORS: Record<string, string> = {
  high: '#FB7185',
  medium: '#F59E0B',
  low: '#10B981',
};

const PRIORITY_LABELS: Record<string, string> = {
  high: '높음',
  medium: '중간',
  low: '낮음',
};

// 샘플 학습 자료
const SAMPLE_ARTICLES = [
  {
    id: '1',
    title: '해외 여행 예산 세우는 법',
    description: '효율적인 여행 예산 계획 가이드',
    category: 'travel',
  },
  {
    id: '2',
    title: '환전 수수료 줄이는 팁',
    description: '해외 여행 시 환전 비용 절감 방법',
    category: 'travel',
  },
  {
    id: '3',
    title: '여행 보험 선택 가이드',
    description: '필요한 여행 보험 종류와 선택 기준',
    category: 'travel',
  },
];

export default function GoalDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams();

  // 목표 찾기
  const goal = mockGoals.find((g) => g.id === id) || mockGoals[0];
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;

  // 목표까지 남은 날짜
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  const daysRemaining = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 월별 필요 저축액
  const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30));
  const monthlyRequired = remaining / monthsRemaining;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-4">
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white flex-1 ml-4">
              {goal.name}
            </Text>
          </View>

          {/* 진행 상황 */}
          <View className="bg-white/10 rounded-lg p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-white/70">진행률</Text>
              <Text className="text-2xl font-bold text-white">
                {progress.toFixed(0)}%
              </Text>
            </View>
            <View className="bg-white/20 rounded-full h-3 overflow-hidden">
              <View
                className="bg-white h-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-white">
                {formatCurrency(goal.currentAmount)}
              </Text>
              <Text className="text-sm text-white">
                {formatCurrency(goal.targetAmount)}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 목표 정보 카드 */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-4">
            <View className="gap-3">
              {/* 우선순위 */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">우선순위</Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: PRIORITY_COLORS[goal.priority] + '20',
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: PRIORITY_COLORS[goal.priority] }}
                  >
                    {PRIORITY_LABELS[goal.priority]}
                  </Text>
                </View>
              </View>

              {/* 목표 날짜 */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">목표 날짜</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {targetDate.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              {/* 남은 기간 */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">남은 기간</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {daysRemaining}일 ({monthsRemaining}개월)
                </Text>
              </View>

              {/* 남은 금액 */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">남은 금액</Text>
                <Text className="text-sm font-bold text-error">
                  {formatCurrency(remaining)}
                </Text>
              </View>

              {/* 월별 필요 저축액 */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted">월별 필요 저축액</Text>
                <Text className="text-sm font-bold text-income">
                  {formatCurrency(monthlyRequired)}
                </Text>
              </View>
            </View>
          </View>

          {/* 설명 */}
          {goal.description && (
            <View className="bg-surface border border-border rounded-lg p-4 gap-2">
              <Text className="text-sm font-semibold text-foreground">설명</Text>
              <Text className="text-sm text-muted leading-relaxed">
                {goal.description}
              </Text>
            </View>
          )}

          {/* 학습 자료 섹션 */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-semibold text-foreground">
                학습 자료
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-primary font-semibold">더보기</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={SAMPLE_ARTICLES}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity className="bg-surface border border-border rounded-lg p-3 mb-2">
                  <View className="flex-row items-start gap-3">
                    <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                      <MaterialIcons name="article" size={18} color={colors.primary} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {item.title}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {item.description}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={18} color={colors.muted} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* 메모 섹션 */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">메모</Text>
              <TouchableOpacity>
                <MaterialIcons name="edit" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-muted">
              이 목표에 대한 메모를 추가하세요. 진행 상황, 계획, 아이디어 등을 기록할 수 있습니다.
            </Text>
          </View>

          {/* 액션 버튼 */}
          <View className="gap-2">
            <TouchableOpacity className="bg-primary rounded-lg py-4 items-center">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="add" size={20} color="white" />
                <Text className="text-white font-bold text-base">저축 추가</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="border border-primary rounded-lg py-4 items-center">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="edit" size={20} color={colors.primary} />
                <Text className="text-primary font-bold text-base">목표 수정</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
