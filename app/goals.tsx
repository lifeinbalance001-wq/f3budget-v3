/**
 * F3Budget V2 - 목표 리스트 화면
 * 모든 저축 목표를 한눈에 보기
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
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

export default function GoalsScreen() {
  const colors = useColors();

  // 목표 진행률 계산
  const goalsWithProgress = mockGoals.map((goal) => ({
    ...goal,
    progress: (goal.currentAmount / goal.targetAmount) * 100,
    remaining: goal.targetAmount - goal.currentAmount,
  }));

  // 우선순위별 정렬
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedGoals = goalsWithProgress.sort(
    (a, b) =>
      (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
      (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
  );

  // 전체 목표 진행률
  const totalTarget = mockGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = mockGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-white">목표</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-8 h-8 rounded-full items-center justify-center bg-white/20"
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* 전체 진행률 */}
          <View className="bg-white/10 rounded-lg p-4 gap-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-white/70">전체 목표 진행률</Text>
              <Text className="text-lg font-bold text-white">
                {overallProgress.toFixed(0)}%
              </Text>
            </View>
            <View className="bg-white/20 rounded-full h-2 overflow-hidden">
              <View
                className="bg-white h-full"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-white/60">
                {formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}
              </Text>
              <Text className="text-xs text-white/60">
                남은 금액: {formatCurrency(Math.max(0, totalTarget - totalCurrent))}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-6 gap-4">
          {sortedGoals.length > 0 ? (
            <>
              {/* 목표 리스트 */}
              <FlatList
                data={sortedGoals}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => router.push(`/goal-detail?id=${item.id}`)}
                    className="bg-surface border border-border rounded-lg p-4 mb-3"
                  >
                    {/* 헤더 */}
                    <View className="flex-row items-start justify-between mb-3">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1">
                          <Text className="text-base font-semibold text-foreground">
                            {item.name}
                          </Text>
                          <View
                            className="px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: PRIORITY_COLORS[item.priority] + '20',
                            }}
                          >
                            <Text
                              className="text-xs font-semibold"
                              style={{ color: PRIORITY_COLORS[item.priority] }}
                            >
                              {PRIORITY_LABELS[item.priority]}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-xs text-muted">{item.description}</Text>
                      </View>
                      <Text className="text-sm font-bold text-primary">
                        {item.progress.toFixed(0)}%
                      </Text>
                    </View>

                    {/* 진행률 바 */}
                    <View className="bg-surface2 rounded-full h-2 overflow-hidden mb-2">
                      <View
                        className="bg-primary h-full"
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
                      />
                    </View>

                    {/* 정보 */}
                    <View className="flex-row justify-between items-end">
                      <View>
                        <Text className="text-xs text-muted mb-1">진행 상황</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {formatCurrency(item.currentAmount)} / {formatCurrency(item.targetAmount)}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xs text-muted mb-1">목표 날짜</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {new Date(item.targetDate).toLocaleDateString('ko-KR', {
                            year: '2-digit',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>

                    {/* 남은 금액 */}
                    <View className="mt-3 pt-3 border-t border-border">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-xs text-muted">남은 금액</Text>
                        <Text
                          className={`text-sm font-bold ${
                            item.remaining > 0 ? 'text-error' : 'text-income'
                          }`}
                        >
                          {item.remaining > 0
                            ? `${formatCurrency(item.remaining)} 필요`
                            : '달성!'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />

              {/* 목표 추가 버튼 */}
              <TouchableOpacity className="bg-primary rounded-lg py-4 items-center mt-2">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="add" size={20} color="white" />
                  <Text className="text-white font-bold text-base">목표 추가</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="target" size={48} color={colors.muted} />
              <Text className="text-muted text-sm mt-2">목표를 추가해보세요</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
