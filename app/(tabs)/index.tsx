/**
 * F3Budget V2 - 허브(대시보드) 화면
 * 현재 재무 상태를 한눈에 보기
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockAccounts, mockTransactions, mockBudgets, mockGoals } from '@/lib/mockData';

export default function HubScreen() {
  const colors = useColors();

  // 총 자산 계산 (현금 + 은행 + 투자 - 신용카드)
  const totalAssets = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const spendableAmount = mockAccounts
    .filter((acc) => acc.type !== 'investment')
    .reduce((sum, acc) => sum + acc.balance, 0);

  // 이번 달 수입/지출
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const monthTransactions = mockTransactions.filter((t) => t.date.startsWith(currentMonth));
  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 예산 진행률 (지출한 예산 / 전체 예산)
  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // 최근 거래 5건
  const recentTransactions = mockTransactions.slice(-5).reverse();

  // 목표 진행률
  const topGoal = mockGoals[0];
  const goalProgress = topGoal ? (topGoal.currentAmount / topGoal.targetAmount) * 100 : 0;

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-2">
          <Text className="text-sm text-white/70">현재 순자산</Text>
          <Text className="text-4xl font-bold text-white">
            {formatCurrency(totalAssets)}
          </Text>
          <Text className="text-sm text-white/60">
            쓸 수 있는 돈: {formatCurrency(spendableAmount)}
          </Text>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 이번 달 수입/지출 카드 */}
          <View className="bg-surface border border-border rounded-xl p-4 gap-4">
            <Text className="text-base font-semibold text-foreground">이번 달 현황</Text>
            <View className="flex-row gap-4">
              {/* 수입 */}
              <View className="flex-1 bg-income/10 rounded-lg p-3 gap-1">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="arrow-downward" size={16} color="#10B981" />
                  <Text className="text-xs text-muted">수입</Text>
                </View>
                <Text className="text-lg font-bold text-income">
                  {formatCurrency(monthIncome)}
                </Text>
              </View>

              {/* 지출 */}
              <View className="flex-1 bg-error/10 rounded-lg p-3 gap-1">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="arrow-upward" size={16} color="#FB7185" />
                  <Text className="text-xs text-muted">지출</Text>
                </View>
                <Text className="text-lg font-bold text-error">
                  {formatCurrency(monthExpense)}
                </Text>
              </View>
            </View>
          </View>

          {/* 예산 진행률 카드 */}
          <View className="bg-surface border border-border rounded-xl p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">예산 현황</Text>
              <Text className="text-sm font-semibold text-primary">
                {budgetPercentage.toFixed(0)}%
              </Text>
            </View>
            <View className="bg-surface2 rounded-full h-2 overflow-hidden">
              <View
                className="bg-primary h-full"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">
                {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
              </Text>
              {budgetPercentage > 100 && (
                <Text className="text-xs text-error">초과: {formatCurrency(totalSpent - totalBudget)}</Text>
              )}
            </View>
          </View>

          {/* 목표 진행 카드 */}
          {topGoal && (
            <View className="bg-surface border border-border rounded-xl p-4 gap-3">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">{topGoal.name}</Text>
                  <Text className="text-xs text-muted mt-1">{topGoal.description}</Text>
                </View>
                <Text className="text-sm font-semibold text-primary">
                  {goalProgress.toFixed(0)}%
                </Text>
              </View>
              <View className="bg-surface2 rounded-full h-2 overflow-hidden">
                <View
                  className="bg-primary h-full"
                  style={{ width: `${Math.min(goalProgress, 100)}%` }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">
                  {formatCurrency(topGoal.currentAmount)} / {formatCurrency(topGoal.targetAmount)}
                </Text>
                <Text className="text-xs text-muted">
                  남은 금액: {formatCurrency(topGoal.targetAmount - topGoal.currentAmount)}
                </Text>
              </View>
            </View>
          )}

          {/* 최근 거래 */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">최근 거래</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/cashflow')}>
                <Text className="text-sm text-primary font-semibold">더보기</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const category = mockBudgets.find((b) => b.categoryId === item.categoryId);
                const isIncome = item.type === 'income';

                return (
                  <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-2">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${
                        isIncome ? 'bg-income/10' : 'bg-error/10'
                      }`}>
                        <MaterialIcons
                          name={isIncome ? 'arrow-downward' : 'arrow-upward'}
                          size={16}
                          color={isIncome ? '#10B981' : '#FB7185'}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {item.memo || '거래'}
                        </Text>
                        <Text className="text-xs text-muted">
                          {new Date(item.date).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className={`text-sm font-bold ${
                        isIncome ? 'text-income' : 'text-error'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                    </Text>
                  </View>
                );
              }}
            />
          </View>

          {/* 거래 추가 버튼 */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-4 items-center mt-2"
            onPress={() => router.push('/add-transaction')}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white font-bold text-base">거래 추가</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
