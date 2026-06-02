// Couple layout - stack navigator for couple management
// Authenticated users without a couple

import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function CoupleLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </>
  )
}
