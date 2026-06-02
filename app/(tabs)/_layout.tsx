// Animated tab bar with icon transitions

import { Tabs } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'

const AnimatedView = Animated.createAnimatedComponent(View)

function TabIcon({ focused, icon }: { focused: boolean; icon: string }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(focused ? 1.15 : 1, { damping: 15, stiffness: 200 }) }],
      opacity: withSpring(focused ? 1 : 0.6, { damping: 20, stiffness: 150 }),
    }
  })

  return (
    <AnimatedView style={[styles.iconContainer, animatedStyle]}>
      <Animated.Text style={styles.icon}>{icon}</Animated.Text>
    </AnimatedView>
  )
}

const icons = {
  index: '🏠',
  habits: '✓',
  profile: '👤',
}

export default function AnimatedTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.green.primary,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.text.primary,
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.index} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.habits} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icons.profile} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    paddingTop: Spacing.xs,
    height: 84,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    backgroundColor: Colors.background.surface,
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 17,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  icon: {
    fontSize: 24,
  },
})
