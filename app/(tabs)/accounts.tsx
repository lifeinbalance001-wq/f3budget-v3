/**
 * F3Budget V2 - 계좌 관리 화면
 * 모든 자산을 유형별로 관리
 */

import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { formatCurrency } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { mockAccounts } from '@/lib/mockData';

type AccountType = 'checking' | 'savings' | 'cash' | 'credit' | 'investment' | 'real_estate';

const ACCOUNT_TYPE_LABELS: Record<AccountType, { label: string; icon: string }> = {
  checking: { label: '입출금', icon: '🏦' },
  savings: { label: '저축', icon: '🏧' },
  cash: { label: '현금', icon: '💵' },
  credit: { label: '신용카드', icon: '💳' },
  investment: { label: '투자', icon: '📈' },
  real_estate: { label: '부동산', icon: '🏠' },
};

export default function AccountsScreen() {
  const colors = useColors();

  // 계좌 유형별 그룹화
  const groupedAccounts = mockAccounts.reduce(
    (acc, account) => {
      const type = account.type as AccountType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(account);
      return acc;
    },
    {} as Record<AccountType, typeof mockAccounts>
  );

  // 유형별 합계 계산
  const getTypeTotal = (type: AccountType) => {
    return (groupedAccounts[type] || []).reduce((sum, acc) => sum + acc.balance, 0);
  };

  // 전체 자산 계산
  const totalAssets = mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const accountTypes = Object.keys(groupedAccounts) as AccountType[];

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* 헤더 */}
        <View className="bg-gradient-to-b from-primary to-primary/80 px-6 py-8 gap-2">
          <Text className="text-sm text-white/70">총 자산</Text>
          <Text className="text-4xl font-bold text-white">
            {formatCurrency(totalAssets)}
          </Text>
        </View>

        <View className="px-6 py-6 gap-6">
          {/* 자산 유형별 섹션 */}
          {accountTypes.map((type) => {
            const accounts = groupedAccounts[type] || [];
            const typeTotal = getTypeTotal(type);
            const typeInfo = ACCOUNT_TYPE_LABELS[type];

            return (
              <View key={type} className="gap-3">
                {/* 유형 헤더 */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-lg">{typeInfo.icon}</Text>
                    <Text className="text-base font-semibold text-foreground">
                      {typeInfo.label}
                    </Text>
                  </View>
                  <Text className="text-base font-bold text-primary">
                    {formatCurrency(typeTotal)}
                  </Text>
                </View>

                {/* 계좌 리스트 */}
                <FlatList
                  data={accounts}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => {
                    const isNegative = item.balance < 0;
                    const balanceColor = isNegative ? 'text-error' : 'text-income';

                    return (
                      <TouchableOpacity className="bg-surface border border-border rounded-lg px-4 py-3 mb-2 flex-row items-center justify-between">
                        <View className="flex-1 gap-1">
                          <Text className="text-sm font-semibold text-foreground">
                            {item.name}
                          </Text>
                          <Text className="text-xs text-muted">
                            {item.bank || '현금'}
                          </Text>
                        </View>
                        <View className="items-end gap-1">
                          <Text className={`text-sm font-bold ${balanceColor}`}>
                            {formatCurrency(item.balance)}
                          </Text>
                          <View className="flex-row items-center gap-1">
                            <View
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <Text className="text-xs text-muted">
                              {item.isActive ? '활성' : '비활성'}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            );
          })}

          {/* 계좌 추가 버튼 */}
          <TouchableOpacity className="bg-primary rounded-lg py-4 items-center mt-4">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="add" size={20} color="white" />
              <Text className="text-white font-bold text-base">계좌 추가</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
