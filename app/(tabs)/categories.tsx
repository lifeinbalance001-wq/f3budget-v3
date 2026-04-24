/**
 * F3Budget V2 - 카테고리 분석 화면
 * 지출을 카테고리별로 분석
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockTransactions, mockCategories, mockBudgets } from '@/lib/mockData';

export default function CategoriesScreen() {
  const colors = useColors();
  const [selectedMonth, setSelectedMonth] = useState('2026-04');

  // 월별 거래 필터링
  const monthTransactions = mockTransactions.filter((t) => t.date.startsWith(selectedMonth));

  // 카테고리별 지출 계산
  const categorySpending = mockCategories.reduce(
    (acc, cat) => {
      const spending = monthTransactions
        .filter((t) => t.categoryId === cat.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      if (spending > 0) {
        acc[cat.id] = {
          category: cat,
          amount: spending,
          budget: mockBudgets.find(
            (b) => b.categoryId === cat.id && b.month === selectedMonth
          ),
        };
      }
      return acc;
    },
    {} as Record<
      string,
      {
        category: typeof mockCategories[0];
        amount: number;
        budget?: typeof mockBudgets[0];
      }
    >
  );

  const categoryList = Object.values(categorySpending).sort((a, b) => b.amount - a.amount);
  const totalSpending = categoryList.reduce((sum, item) => sum + item.amount, 0);

  // 월 네비게이션
  const handlePrevMonth = () => {
    const [year, month] = selectedMonth.split('-');
    const prevMonth = parseInt(month) - 1;
    if (prevMonth === 0) {
      setSelectedMonth(`${parseInt(year) - 1}-12`);
    } else {
      setSelectedMonth(`${year}-${String(prevMonth).padStart(2, '0')}`);
    }
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-');
    const nextMonth = parseInt(month) + 1;
    if (nextMonth === 13) {
      setSelectedMonth(`${parseInt(year) + 1}-01`);
    } else {
      setSelectedMonth(`${year}-${String(nextMonth).padStart(2, '0')}`);
    }
  };

  const monthLabel = new Date(`${selectedMonth}-01`).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-4">
          {/* 월 선택 */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handlePrevMonth}>
              <MaterialIcons name="chevron-left" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">{monthLabel}</Text>
            <TouchableOpacity onPress={handleNextMonth}>
              <MaterialIcons name="chevron-right" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* 총 지출 */}
          <View className="bg-white/10 rounded-lg p-3 gap-1">
            <Text className="text-xs text-white/70">이번 달 지출</Text>
            <Text className="text-2xl font-bold text-white">
              {formatCurrency(totalSpending)}
            </Text>
          </View>
        </View>

        <View className="px-6 py-6 gap-4">
          {categoryList.length > 0 ? (
            <>
              {/* 카테고리 리스트 */}
              <FlatList
                data={categoryList}
                keyExtractor={(item) => item.category.id}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const percentage = (item.amount / totalSpending) * 100;
                  const isOverBudget =
                    item.budget && item.amount > item.budget.amount;

                  return (
                    <View className="bg-surface border border-border rounded-lg p-4 mb-3">
                      {/* 카테고리 헤더 */}
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center gap-2 flex-1">
                          <Text className="text-lg">{item.category.icon}</Text>
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-foreground">
                              {item.category.name}
                            </Text>
                            {item.budget && (
                              <Text className="text-xs text-muted">
                                예산: {formatCurrency(item.budget.amount)}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View className="items-end">
                          <Text className="text-sm font-bold text-foreground">
                            {formatCurrency(item.amount)}
                          </Text>
                          <Text className="text-xs text-muted">
                            {percentage.toFixed(1)}%
                          </Text>
                        </View>
                      </View>

                      {/* 진행률 바 */}
                      <View className="gap-2">
                        <View className="bg-surface2 rounded-full h-2 overflow-hidden">
                          <View
                            className={`h-full ${
                              isOverBudget ? 'bg-error' : 'bg-primary'
                            }`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </View>

                        {/* 예산 상태 */}
                        {item.budget && (
                          <View className="flex-row justify-between items-center">
                            <Text className="text-xs text-muted">
                              {item.budget.amount > 0
                                ? `남은 예산: ${formatCurrency(
                                    Math.max(0, item.budget.amount - item.amount)
                                  )}`
                                : '예산 없음'}
                            </Text>
                            {isOverBudget && (
                              <View className="flex-row items-center gap-1">
                                <MaterialIcons
                                  name="warning"
                                  size={14}
                                  color="#FB7185"
                                />
                                <Text className="text-xs text-error">
                                  초과: {formatCurrency(item.amount - item.budget.amount)}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
              />

              {/* 카테고리 추가 버튼 */}
              <TouchableOpacity className="bg-primary rounded-lg py-4 items-center mt-2">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="add" size={20} color="white" />
                  <Text className="text-white font-bold text-base">카테고리 추가</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="inbox" size={48} color={colors.muted} />
              <Text className="text-muted text-sm mt-2">이 달의 지출이 없습니다</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
