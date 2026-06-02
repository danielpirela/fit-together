import 'react-native-reanimated'
import '@tanstack/react-query'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ToastProvider } from '@/shared/components/toast'
import '../src/global.css'

export default function RootLayout() {
  return (
    <ToastProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="couple" options={{ headerShown: false }} />
        <Stack.Screen
          name="index"
          options={{
            title: 'Together Habit Tracking',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ToastProvider>
  )
}
