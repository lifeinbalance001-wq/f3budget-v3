import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HapticTab } from '@/components/haptic-tab';
import { useColors } from '@/hooks/use-colors';

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'web' ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -4,
        },
      }}
    >
      <Tabs.Screen
        name="accounts"
        options={{
          title: '계좌',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="credit-card" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cashflow"
        options={{
          title: '현금흐름',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '허브',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: '카테고리',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recurrings"
        options={{
          title: '반복지출',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="repeat" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
