// LoadingSpinner component following Apple HIG
// Native ActivityIndicator wrapped with styling

import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Colors } from '@/shared/constants/theme-colors'

interface LoadingSpinnerProps {
  size?: 'small' | 'large'
  color?: string
  fullScreen?: boolean
}

const _SIZES = {
  small: 20,
  large: 36,
}

export function LoadingSpinner({
  size = 'large',
  color = Colors.green.primary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
      </View>
    )
  }

  return <ActivityIndicator size={size} color={color} />
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
})
