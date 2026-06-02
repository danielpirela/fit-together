// Toast notification system for React Native
// Simple implementation using React Context

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION = 3000

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: '#E8F5E9', border: '#4CAF50', icon: '✓' },
  error: { bg: '#FFEBEE', border: '#F44336', icon: '✕' },
  info: { bg: '#E3F2FD', border: '#2196F3', icon: 'ℹ' },
  warning: { bg: '#FFF8E1', border: '#FFC107', icon: '⚠' },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-100)).current
  const colors = TOAST_COLORS[toast.type]

  Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.spring(translateY, {
      toValue: 0,
      damping: 15,
      stiffness: 150,
      useNativeDriver: true,
    }),
  ]).start()

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(onDismiss)
  }

  // Auto dismiss
  setTimeout(handleDismiss, toast.duration || DEFAULT_DURATION)

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: colors.bg,
          borderLeftColor: colors.border,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={handleDismiss} style={styles.toastContent}>
        <View style={[styles.iconContainer, { backgroundColor: colors.border }]}>
          <Text style={styles.icon}>{colors.icon}</Text>
        </View>
        <Text style={styles.message} numberOfLines={3}>
          {toast.message}
        </Text>
      </Pressable>
    </Animated.View>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${++counterRef.current}`
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast],
  )

  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration),
    [showToast],
  )

  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast],
  )

  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast],
  )

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    // Return noop functions if not in provider
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
    }
  }
  return context
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    width: SCREEN_WIDTH - 40,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    lineHeight: 20,
  },
})
