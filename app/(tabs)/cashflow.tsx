/**
 * F3Budget V2 - 현금흐름 분석 화면
 * 수입/지출 분석 및 월별 비교
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockTransactions } from '@/lib/mockData';

export default function CashflowScreen() {
  const colors = useColors();
  const [selectedMonth, setSelectedMonth] = useState('2026-04');

  // 거래를 날짜별로 그룹화
  const groupedTransactions = mockTransactions.reduce(
    (acc, tx) => {
      if (tx.date.startsWith(selectedMonth)) {
        const date = tx.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(tx);
      }
      return acc;
    },
    {} as Record<string, typeof mockTransactions>
  );

  // 날짜별 정렬
  const sortedDates = Object.keys(groupedTransactions).sort().reverse();

  // 월별 수입/지출 계산
  const monthTransactions = mockTransactions.filter((t) => t.date.startsWith(selectedMonth));
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netCashflow = totalIncome - totalExpense;

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

          {/* 수입/지출/순현금흐름 */}
          <View className="gap-3">
            <View className="flex-row gap-2">
              {/* 수입 */}
              <View className="flex-1 bg-white/10 rounded-lg p-3 gap-1">
                <Text className="text-xs text-white/70">수입</Text>
                <Text className="text-lg font-bold text-white">
                  {formatCurrency(totalIncome)}
                </Text>
              </View>

              {/* 지출 */}
              <View className="flex-1 bg-white/10 rounded-lg p-3 gap-1">
                <Text className="text-xs text-white/70">지출</Text>
                <Text className="text-lg font-bold text-white">
                  {formatCurrency(totalExpense)}
                </Text>
              </View>
            </View>

            {/* 순현금흐름 */}
            <View
              className={`rounded-lg p-3 gap-1 ${
                netCashflow >= 0 ? 'bg-income/20' : 'bg-error/20'
              }`}
            >
              <Text className="text-xs text-white/70">순현금흐름</Text>
              <Text
                className={`text-xl font-bold ${
                  netCashflow >= 0 ? 'text-income' : 'text-error'
                }`}
              >
                {netCashflow >= 0 ? '+' : ''}{formatCurrency(netCashflow)}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 날짜별 거래 */}
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => {
              const transactions = groupedTransactions[date];
              const dateObj = new Date(date);
              const dateLabel = dateObj.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              });

              const dayIncome = transactions
                .filter((t) => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
              const dayExpense = transactions
                .filter((t) => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <View key={date} className="gap-2">
                  {/* 날짜 헤더 */}
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-semibold text-foreground">
                      {dateLabel}
                    </Text>
                    <Text className="text-xs text-muted">
                      {dayIncome > 0 && `+${formatCurrency(dayIncome)} `}
                      {dayExpense > 0 && `-${formatCurrency(dayExpense)}`}
                    </Text>
                  </View>

                  {/* 거래 리스트 */}
                  <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                      const isIncome = item.type === 'income';

                      return (
                        <View className="flex-row items-center justify-between bg-surface border border-border rounded-lg px-4 py-3 mb-2">
                          <View className="flex-row items-center gap-3 flex-1">
                            <View
                              className={`w-10 h-10 rounded-full items-center justify-center ${
                                isIncome ? 'bg-income/10' : 'bg-error/10'
                              }`}
                            >
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
                                {item.categoryId ? '분류됨' : '미분류'}
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
              );
            })
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons name="inbox" size={48} color={colors.muted} />
              <Text className="text-muted text-sm mt-2">이 달의 거래가 없습니다</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
