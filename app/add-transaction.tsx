import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAccounts, useCategories, useTransactions, useHousehold } from "@/lib/AppContext";
import { generateId, getTodayString } from "@/lib/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

const NUMPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "⌫"];
type TransactionType = "income" | "expense" | "transfer";

export default function AddTransactionScreen() {
  const colors = useColors();
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { addTransaction } = useTransactions();
  const { currentHousehold } = useHousehold();

  const [txType, setTxType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id ?? ""
  );
  const [date, setDate] = useState(getTodayString());
  const [memo, setMemo] = useState("");

  const s = styles(colors);

  const filteredCategories = categories.filter(
    (c) => c.type === txType
  );

  const handleNumpad = (key: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (key === "⌫") {
      setAmount((prev) => {
        const next = prev.slice(0, -1);
        return next === "" || next === "0" ? "0" : next;
      });
    } else if (key === "000") {
      setAmount((prev) => (prev === "0" ? "0" : prev + "000"));
    } else {
      setAmount((prev) => {
        if (prev === "0") return key;
        return prev + key;
      });
    }
  };

  const handleSave = () => {
    const numAmount = parseInt(amount, 10);
    if (!numAmount || numAmount <= 0) {
      Alert.alert("알림", "금액을 입력해주세요.");
      return;
    }
    if (txType !== "transfer" && !selectedCategoryId) {
      Alert.alert("알림", "카테고리를 선택해주세요.");
      return;
    }
    if (!selectedAccountId) {
      Alert.alert("알림", "계좌를 선택해주세요.");
      return;
    }

    const newTransaction = {
      id: generateId(),
      householdId: currentHousehold?.id || "",
      type: txType,
      amount: numAmount,
      currency: "KRW",
      categoryId: txType !== "transfer" ? selectedCategoryId : undefined,
      accountId: selectedAccountId,
      date,
      memo: memo.trim() || undefined,
      isRecurring: false,
      createdBy: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTransaction(newTransaction);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.back();
  };

  const formattedAmount = parseInt(amount, 10).toLocaleString("ko-KR");

  return (
    <ScreenContainer
      containerClassName="bg-background"
      edges={["top", "left", "right", "bottom"]}
    >
      {/* 헤더 */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={s.headerTitle}>거래 입력</Text>
        <Pressable style={s.saveBtn} onPress={handleSave}>
          <Text style={s.saveBtnText}>저장</Text>
        </Pressable>
      </View>

      {/* 수입/지출 토글 */}
      <View style={s.typeToggle}>
        <Pressable
          style={[
            s.typeBtn,
            txType === "expense" && { backgroundColor: "#FB7185" },
          ]}
          onPress={() => {
            setTxType("expense");
            setSelectedCategoryId(null);
          }}
        >
          <Text
            style={[
              s.typeBtnText,
              txType === "expense" && { color: "#fff", fontWeight: "700" },
            ]}
          >
            지출
          </Text>
        </Pressable>
        <Pressable
          style={[
            s.typeBtn,
            txType === "income" && { backgroundColor: "#34D399" },
          ]}
          onPress={() => {
            setTxType("income");
            setSelectedCategoryId(null);
          }}
        >
          <Text
            style={[
              s.typeBtnText,
              txType === "income" && { color: "#fff", fontWeight: "700" },
            ]}
          >
            수입
          </Text>
        </Pressable>
        <Pressable
          style={[
            s.typeBtn,
            txType === "transfer" && { backgroundColor: colors.primary },
          ]}
          onPress={() => {
            setTxType("transfer");
            setSelectedCategoryId(null);
          }}
        >
          <Text
            style={[
              s.typeBtnText,
              txType === "transfer" && { color: "#fff", fontWeight: "700" },
            ]}
          >
            이체
          </Text>
        </Pressable>      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* 금액 표시 */}
        <View style={s.amountDisplay}>
          <Text style={s.amountCurrency}>₩</Text>
          <Text
            style={[
              s.amountText,
              { color: txType === "income" ? "#34D399" : "#FB7185" },
            ]}
          >
            {formattedAmount}
          </Text>
        </View>

        {/* 숫자 키패드 */}
        <View style={s.numpad}>
          {NUMPAD.map((key) => (
            <Pressable
              key={key}
              style={({ pressed }) => [
                s.numKey,
                key === "⌫" && s.numKeyBack,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => handleNumpad(key)}
            >
              {key === "⌫" ? (
                <MaterialIcons name="backspace" size={22} color={colors.foreground} />
              ) : (
                <Text style={s.numKeyText}>{key}</Text>
              )}
            </Pressable>
          ))}
        </View>

        {/* 카테고리 선택 */}
        {txType !== "transfer" && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>카테고리</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.catRow}>
              {filteredCategories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    s.catChip,
                    selectedCategoryId === cat.id && {
                      backgroundColor: cat.color + "22",
                      borderColor: cat.color,
                    },
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <MaterialIcons
                    name={(cat.icon as any) ?? "category"}
                    size={16}
                    color={
                      selectedCategoryId === cat.id ? cat.color : colors.muted
                    }
                  />
                  <Text
                    style={[
                      s.catChipText,
                      selectedCategoryId === cat.id && {
                        color: cat.color,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
        )}

        {/* 계좌 선택 */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>계좌</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.catRow}>
              {accounts.map((account) => (
                <Pressable
                  key={account.id}
                  style={[
                    s.catChip,
                    selectedAccountId === account.id && {
                      backgroundColor: colors.primary + "22",
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => setSelectedAccountId(account.id)}
                >
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={16}
                    color={
                      selectedAccountId === account.id ? colors.primary : colors.muted
                    }
                  />
                  <Text
                    style={[
                      s.catChipText,
                      selectedAccountId === account.id && {
                        color: colors.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {account.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 날짜 */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>날짜</Text>
          <TextInput
            style={s.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* 메모 */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>메모 (선택)</Text>
          <TextInput
            style={s.memoInput}
            value={memo}
            onChangeText={setMemo}
            placeholder="메모를 입력하세요"
            placeholderTextColor={colors.muted}
            multiline
            returnKeyType="done"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.foreground,
    },
    saveBtn: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    saveBtnText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#fff",
    },
    typeToggle: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 16,
      marginBottom: 8,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeBtn: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      borderRadius: 10,
    },
    typeBtnText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.muted,
    },
    amountDisplay: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingVertical: 20,
      gap: 4,
    },
    amountCurrency: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.muted,
      paddingBottom: 4,
    },
    amountText: {
      fontSize: 48,
      fontWeight: "800",
      letterSpacing: -1,
    },
    numpad: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 20,
      gap: 8,
      marginBottom: 16,
    },
    numKey: {
      width: "30%",
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    numKeyBack: {
      backgroundColor: colors.surface,
    },
    numKeyText: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.foreground,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.muted,
      marginBottom: 8,
    },
    catRow: {
      flexDirection: "row",
      gap: 8,
    },
    catChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    catChipText: {
      fontSize: 13,
      color: colors.muted,
    },
    dateInput: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    memoInput: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      fontSize: 15,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 80,
      textAlignVertical: "top",
    },
  });
