// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * SF Symbols to Material Icons mappings.
 */
const MAPPING: IconMapping = {
  // Navigation tabs
  "house.fill": "home",
  "list.bullet": "list",
  "creditcard.fill": "account-balance-wallet",
  "target": "track-changes",
  "ellipsis": "more-horiz",
  // Common
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.down": "expand-more",
  "chevron.up": "expand-less",
  "plus": "add",
  "plus.circle.fill": "add-circle",
  "minus": "remove",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "pencil": "edit",
  "trash": "delete",
  "gear": "settings",
  "bell": "notifications",
  "bell.fill": "notifications",
  "magnifyingglass": "search",
  "arrow.left": "arrow-back",
  "arrow.right": "arrow-forward",
  "arrow.up": "arrow-upward",
  "arrow.down": "arrow-downward",
  "calendar": "calendar-today",
  "clock": "access-time",
  "star.fill": "star",
  "heart.fill": "favorite",
  "info.circle": "info",
  "exclamationmark.circle": "error",
  "eye": "visibility",
  "eye.slash": "visibility-off",
  "lock.fill": "lock",
  "person.fill": "person",
  "photo": "photo",
  "square.and.arrow.up": "share",
  "doc.fill": "description",
  "chart.bar.fill": "bar-chart",
  "chart.pie.fill": "pie-chart",
  "waveform": "show-chart",
  "moon.fill": "dark-mode",
  "sun.max.fill": "light-mode",
  // Finance specific
  "banknote": "payments",
  "creditcard": "credit-card",
  "building.columns": "account-balance",
  "chart.line.uptrend.xyaxis": "trending-up",
  "chart.line.downtrend.xyaxis": "trending-down",
  "dollarsign.circle.fill": "monetization-on",
  "wallet.pass.fill": "account-balance-wallet",
  // Category icons
  "fork.knife": "restaurant",
  "cup.and.saucer.fill": "local-cafe",
  "bag.fill": "shopping-bag",
  "bus.fill": "directions-bus",
  "house.fill.badge.plus": "home",
  "cross.fill": "local-hospital",
  "film.fill": "movie",
  "graduationcap.fill": "school",
  "iphone": "phone-android",
  "shield.fill": "security",
  "gift.fill": "card-giftcard",
  "scissors": "face",
  "airplane": "flight",
  "pawprint.fill": "pets",
  "car.fill": "directions-car",
  "play.rectangle.fill": "subscriptions",
  "ellipsis.circle": "more-horiz",
  "briefcase.fill": "work",
  "repeat": "replay",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const mappedName = MAPPING[name] ?? "help-outline";
  return <MaterialIcons color={color} size={size} name={mappedName} style={style} />;
}
