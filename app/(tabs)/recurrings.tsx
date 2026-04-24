/**
 * F3Budget V2 - 반복지출 관리 화면
 * 매월 자동으로 발생하는 거래 관리
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList, Switch } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockRecurrings, mockAccounts } from '@/lib/mockData';

type FrequencyType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

const FREQUENCY_LABELS: Record<FrequencyType, string> = {
  daily: '매일',
  weekly: '매주',
  biweekly: '격주',
  monthly: '매월',
  quarterly: '분기',
  yearly: '연간',
};

export default function RecurringsScreen() {
  const colors = useColors();
  const [toggledRecurrings, setToggledRecurrings] = useState<Record<string, boolean>>(
    mockRecurrings.reduce((acc, r) => ({ ...acc, [r.id]: r.isActive }), {})
  );

  // 반복지출 그룹화 (수입/지출)
  const expenseRecurrings = mockRecurrings.filter((r) => r.type === 'expense');
  const incomeRecurrings = mockRecurrings.filter((r) => r.type === 'income');

  // 월별 예상 금액 계산
  const monthlyExpense = expenseRecurrings.reduce((sum, r) => {
    if (toggledRecurrings[r.id]) {
      if (r.frequency === 'monthly') return sum + r.amount;
      if (r.frequency === 'yearly') return sum + r.amount / 12;
    }
    return sum;
  }, 0);

  const monthlyIncome = incomeRecurrings.reduce((sum, r) => {
    if (toggledRecurrings[r.id]) {
      if (r.frequency === 'monthly') return sum + r.amount;
      if (r.frequency === 'yearly') return sum + r.amount / 12;
    }
    return sum;
  }, 0);

  const handleToggle = (id: string) => {
    setToggledRecurrings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const RecurringItem = ({ recurring }: { recurring: typeof mockRecurrings[0] }) => {
    const account = mockAccounts.find((a) => a.id === recurring.accountId);
    const isActive = toggledRecurrings[recurring.id];

    return (
      <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-2">
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              recurring.type === 'income' ? 'bg-income/10' : 'bg-error/10'
            }`}
          >
            <MaterialIcons
              name={recurring.type === 'income' ? 'arrow-downward' : 'arrow-upward'}
              size={16}
              color={recurring.type === 'income' ? '#10B981' : '#FB7185'}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-foreground">
              {recurring.name}
            </Text>
            <Text className="text-xs text-muted">
              {FREQUENCY_LABELS[recurring.frequency as FrequencyType]} • {account?.name}
            </Text>
          </View>
        </View>
        <View className="items-end gap-2">
          <Text
            className={`text-sm font-bold ${
              recurring.type === 'income' ? 'text-income' : 'text-error'
            }`}
          >
            {recurring.type === 'income' ? '+' : '-'}{formatCurrency(recurring.amount)}
          </Text>
          <Switch
            value={isActive}
            onValueChange={() => handleToggle(recurring.id)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isActive ? colors.primary : colors.muted}
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-4">
          <Text className="text-sm text-white/70">월 예상 금액</Text>
          <View className="flex-row gap-4">
            {/* 월 예상 지출 */}
            <View className="flex-1 bg-white/10 rounded-lg p-3 gap-1">
              <Text className="text-xs text-white/70">지출</Text>
              <Text className="text-lg font-bold text-white">
                {formatCurrency(monthlyExpense)}
              </Text>
            </View>

            {/* 월 예상 수입 */}
            <View className="flex-1 bg-white/10 rounded-lg p-3 gap-1">
              <Text className="text-xs text-white/70">수입</Text>
              <Text className="text-lg font-bold text-white">
                {formatCurrency(monthlyIncome)}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 반복 지출 */}
          {expenseRecurrings.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="arrow-upward" size={20} color="#FB7185" />
                <Text className="text-base font-semibold text-foreground">
                  반복 지출
                </Text>
                <Text className="text-sm text-muted">
                  ({expenseRecurrings.length}개)
                </Text>
              </View>
              <FlatList
                data={expenseRecurrings}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => <RecurringItem recurring={item} />}
              />
            </View>
          )}

          {/* 반복 수입 */}
          {incomeRecurrings.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="arrow-downward" size={20} color="#10B981" />
                <Text className="text-base font-semibold text-foreground">
                  반복 수입
                </Text>
                <Text className="text-sm text-muted">
                  ({incomeRecurrings.length}개)
                </Text>
              </View>
              <FlatList
                data={incomeRecurrings}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => <RecurringItem recurring={item} />}
              />
            </View>
          )}

          {/* 반복 거래 추가 버튼 */}
          <TouchableOpacity className="bg-primary rounded-lg py-4 items-center mt-2">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white font-bold text-base">반복 거래 추가</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
