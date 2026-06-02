// Habit Grid Cell Component - React Native
// Shows completion status with diagonal split or solid color

import { View, StyleSheet, useWindowDimensions } from "react-native";
import type { CellStatus } from "@/core/entities";
import { Colors } from "@/shared/constants/theme";

interface HabitGridCellProps {
  status: CellStatus;
  size?: number;
}

const STATUS_COLORS: Record<CellStatus, { topLeft?: string; bottomRight?: string; solid?: string }> = {
  both_completed: {
    topLeft: Colors.green.primary,
    bottomRight: Colors.purple.primary,
  },
  only_partner_a: {
    solid: Colors.purple.primary, // User A didn't complete, show User B's non-completed color
  },
  only_partner_b: {
    solid: Colors.green.primary, // User B didn't complete, show User A's non-completed color
  },
  none_completed: {
    solid: Colors.gray[200],
  },
};

// Simple diagonal split using two triangles with rotation
function DiagonalSplit({ 
  size, 
  topLeftColor, 
  bottomRightColor 
}: { 
  size: number; 
  topLeftColor: string; 
  bottomRightColor: string;
}) {
  // Create diagonal effect with two overlaid triangles
  const triangleWidth = size * 1.5;
  const triangleHeight = size * 1.5;
  
  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      {/* Bottom right triangle (purple) - positioned in bottom-right */}
      <View
        style={{
          position: "absolute",
          width: triangleWidth,
          height: triangleHeight,
          backgroundColor: bottomRightColor,
          transform: [
            { rotate: "45deg" },
            { translateX: -size * 0.6 },
            { translateY: -size * 0.6 },
          ],
        }}
      />
      {/* Top left triangle (green) */}
      <View
        style={{
          position: "absolute",
          width: triangleWidth,
          height: triangleHeight,
          backgroundColor: topLeftColor,
          transform: [
            { rotate: "45deg" },
            { translateX: -size * 0.6 },
            { translateY: -size * 0.4 },
          ],
        }}
      />
    </View>
  );
}

export function HabitGridCell({
  status,
  size = 32,
}: HabitGridCellProps) {
  const config = STATUS_COLORS[status];

  const containerStyle = {
    width: size,
    height: size,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.gray[300],
  };

  if (status === "both_completed") {
    return (
      <DiagonalSplit
        size={size}
        topLeftColor={config.topLeft!}
        bottomRightColor={config.bottomRight!}
      />
    );
  }

  // Solid color
  return (
    <View
      style={[
        containerStyle,
        { backgroundColor: config.solid },
      ]}
    />
  );
}