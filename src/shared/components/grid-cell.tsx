// Grid cell component
// Shows completion status with diagonal split for "both completed" or solid colors

import { StyleSheet, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'

type CellStatus = 'both' | 'mine-only' | 'partner-only' | 'none' | 'future' | 'non-target'

interface GridCellProps {
  status: CellStatus
  size?: number
}

const STATUS_COLORS: Record<CellStatus, string | { topLeft: string; bottomRight: string }> = {
  both: { topLeft: Colors.green.primary, bottomRight: Colors.purple.primary },
  'mine-only': Colors.green.primary,
  'partner-only': Colors.purple.primary,
  none: Colors.gray[100],
  future: Colors.gray[50],
  'non-target': 'transparent',
}

export function GridCell({ status, size = 12 }: GridCellProps) {
  const colorConfig = STATUS_COLORS[status]

  if (status === 'both') {
    const colors = colorConfig as { topLeft: string; bottomRight: string }
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View
          style={[
            styles.triangle,
            {
              borderLeftWidth: size,
              borderBottomWidth: size,
              borderLeftColor: colors.topLeft,
              borderBottomColor: 'transparent',
            },
          ]}
        />
        <View
          style={[
            styles.triangleBottom,
            {
              borderLeftWidth: size,
              borderTopWidth: size,
              borderLeftColor: colors.bottomRight,
              borderTopColor: 'transparent',
            },
          ]}
        />
      </View>
    )
  }

  if (status === 'non-target') {
    return <View style={{ width: size, height: size }} />
  }

  return (
    <View
      style={[
        styles.solid,
        {
          width: size,
          height: size,
          backgroundColor: colorConfig as string,
        },
      ]}
    />
  )
}

// Simple solid cell without border
export function SolidGridCell({ color, size = 12 }: { color: string; size?: number }) {
  return <View style={[styles.solid, { width: size, height: size, backgroundColor: color }]} />
}

// Diagonal split cell using rotation
export function DiagonalGridCell({
  size = 12,
  topLeftColor = Colors.green.primary,
  bottomRightColor = Colors.purple.primary,
}: {
  size?: number
  topLeftColor?: string
  bottomRightColor?: string
}) {
  return (
    <View style={[styles.diagonalContainer, { width: size, height: size }]}>
      <View
        style={[
          styles.diagonalTopLeft,
          {
            backgroundColor: topLeftColor,
            width: size * Math.SQRT1_2,
            height: size * Math.SQRT1_2,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.diagonalBottomRight,
          {
            backgroundColor: bottomRightColor,
            width: size * Math.SQRT1_2,
            height: size * Math.SQRT1_2,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  triangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  triangleBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
  solid: {
    borderRadius: 2,
  },
  diagonalContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  diagonalTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  diagonalBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
})
