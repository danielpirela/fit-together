// Grid legend component
// Explains the color coding for the activity grid

import { StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'

export function GridLegend() {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View style={[styles.swatch, styles.bothSwatch]}>
          <View style={[styles.half, styles.halfTopLeft]} />
          <View style={[styles.half, styles.halfBottomRight]} />
        </View>
        <Text style={styles.label}>Both</Text>
      </View>

      <View style={styles.item}>
        <View style={[styles.swatch, { backgroundColor: Colors.green.primary }]} />
        <Text style={styles.label}>You</Text>
      </View>

      <View style={styles.item}>
        <View style={[styles.swatch, { backgroundColor: Colors.purple.primary }]} />
        <Text style={styles.label}>Partner</Text>
      </View>

      <View style={styles.item}>
        <View style={[styles.swatch, { backgroundColor: Colors.gray[100] }]} />
        <Text style={styles.label}>None</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bothSwatch: {
    flexDirection: 'row',
    position: 'relative',
  },
  half: {
    width: 6,
    height: 12,
  },
  halfTopLeft: {
    backgroundColor: Colors.green.primary,
  },
  halfBottomRight: {
    backgroundColor: Colors.purple.primary,
  },
  label: {
    fontSize: 12,
    color: Colors.gray[400],
  },
})
