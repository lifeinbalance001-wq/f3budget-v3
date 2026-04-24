/**
 * F3Budget V2 - 복기(Calendar) 화면
 * 날짜별로 거래를 복기하고 관리
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockTransactions } from '@/lib/mockData';

export default function CalendarScreen() {
  const colors = useColors();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMonth, setSelectedMonth] = useState('2026-04');

  // 선택된 날짜의 거래
  const selectedTransactions = mockTransactions.filter((t) => t.date === selectedDate);

  // 월별 거래 그룹화
  const monthTransactions = mockTransactions.filter((t) => t.date.startsWith(selectedMonth));

  // 날짜별 거래 금액 계산
  const dailyTotals = monthTransactions.reduce(
    (acc, tx) => {
      const date = tx.date;
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') {
        acc[date].income += tx.amount;
      } else if (tx.type === 'expense') {
        acc[date].expense += tx.amount;
      }
      return acc;
    },
    {} as Record<string, { income: number; expense: number }>
  );

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

  // 달력 생성
  const [year, month] = selectedMonth.split('-');
  const firstDay = new Date(`${year}-${month}-01`);
  const lastDay = new Date(parseInt(year), parseInt(month), 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const selectedDateObj = new Date(selectedDate);
  const selectedDateLabel = selectedDateObj.toLocaleDateString('ko-KR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const selectedDayTotal = dailyTotals[selectedDate];

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

          {/* 선택된 날짜 정보 */}
          <View className="bg-white/10 rounded-lg p-3 gap-2">
            <Text className="text-sm text-white/70">{selectedDateLabel}</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs text-white/60 mb-1">수입</Text>
                <Text className="text-lg font-bold text-white">
                  {formatCurrency(selectedDayTotal?.income || 0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-white/60 mb-1">지출</Text>
                <Text className="text-lg font-bold text-white">
                  {formatCurrency(selectedDayTotal?.expense || 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 달력 */}
          <View className="bg-surface border border-border rounded-lg p-4 gap-4">
            {/* 요일 헤더 */}
            <View className="flex-row justify-between">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <Text key={day} className="text-xs font-semibold text-muted text-center w-1/7">
                  {day}
                </Text>
              ))}
            </View>

            {/* 날짜 그리드 */}
            <View className="gap-2">
              {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, week) => (
                <View key={week} className="flex-row justify-between gap-1">
                  {calendarDays.slice(week * 7, (week + 1) * 7).map((day, index) => {
                    if (!day) {
                      return <View key={`empty-${index}`} className="flex-1 h-16" />;
                    }

                    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
                    const isSelected = dateStr === selectedDate;
                    const dayTotal = dailyTotals[dateStr];
                    const hasTransaction = dayTotal && (dayTotal.income > 0 || dayTotal.expense > 0);

                    return (
                      <Pressable
                        key={day}
                        onPress={() => setSelectedDate(dateStr)}
                        className={`flex-1 h-16 rounded-lg items-center justify-center ${
                          isSelected
                            ? 'bg-primary'
                            : hasTransaction
                            ? 'bg-primary/20 border border-primary'
                            : 'bg-surface2'
                        }`}
                      >
                        <Text
                          className={`text-xs font-semibold mb-1 ${
                            isSelected ? 'text-white' : 'text-foreground'
                          }`}
                        >
                          {day}
                        </Text>
                        {dayTotal && (dayTotal.income > 0 || dayTotal.expense > 0) && (
                          <View className="gap-0.5">
                            {dayTotal.income > 0 && (
                              <Text className="text-xs text-income font-bold">
                                +{(dayTotal.income / 1000).toFixed(0)}k
                              </Text>
                            )}
                            {dayTotal.expense > 0 && (
                              <Text className="text-xs text-error font-bold">
                                -{(dayTotal.expense / 1000).toFixed(0)}k
                              </Text>
                            )}
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* 선택된 날짜의 거래 */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-foreground">거래 내역</Text>
              <Text className="text-sm text-muted">
                {selectedTransactions.length}건
              </Text>
            </View>

            {selectedTransactions.length > 0 ? (
              <FlatList
                data={selectedTransactions}
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
                            {new Date(item.date).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
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
            ) : (
              <View className="items-center justify-center py-8">
                <MaterialIcons name="inbox" size={40} color={colors.muted} />
                <Text className="text-muted text-sm mt-2">이 날짜에 거래가 없습니다</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
