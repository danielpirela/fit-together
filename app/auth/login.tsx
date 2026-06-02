// Animated login screen with staggered entry
// Entry animations: logo bounce, title fade, form slide, button reveal

import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'

const AnimatedView = Animated.createAnimatedComponent(View)

export default function LoginScreen() {
  const router = useRouter()
  const { signIn, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // Animation values - initialized once
  const logoScale = useSharedValue(0.8)
  const logoOpacity = useSharedValue(0)
  const titleTranslateY = useSharedValue(20)
  const titleOpacity = useSharedValue(0)
  const formTranslateY = useSharedValue(30)
  const formOpacity = useSharedValue(0)
  const buttonTranslateY = useSharedValue(40)
  const buttonOpacity = useSharedValue(0)

  // Entrance animation sequence
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Logo bounces in
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 })
    logoOpacity.value = withSpring(1)

    // Title fades in after logo
    titleTranslateY.value = withDelay(100, withSpring(0))
    titleOpacity.value = withDelay(100, withSpring(1))

    // Form slides up after title
    formTranslateY.value = withDelay(200, withSpring(0))
    formOpacity.value = withDelay(200, withSpring(1))

    // Button reveals last
    buttonTranslateY.value = withDelay(400, withSpring(0))
    buttonOpacity.value = withDelay(400, withSpring(1))
  }, [])

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }))

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleTranslateY.value }],
    opacity: titleOpacity.value,
  }))

  const formStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
    opacity: formOpacity.value,
  }))

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    opacity: buttonOpacity.value,
  }))

  const validateForm = () => {
    let valid = true
    setEmailError('')
    setPasswordError('')

    if (!email) {
      setEmailError('Email is required')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      valid = false
    }

    if (!password) {
      setPasswordError('Password is required')
      valid = false
    }

    return valid
  }

  const handleSubmit = async () => {
    clearError()
    if (!validateForm()) return

    try {
      await signIn(email, password)
    } catch (_e) {
      // Error is handled by store
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Logo */}
        <AnimatedView style={[styles.logoContainer, logoStyle]}>
          <Text style={styles.logo}>💪</Text>
        </AnimatedView>

        {/* Animated Header */}
        <AnimatedView style={titleStyle}>
          <Text style={styles.title}>Together Habits</Text>
          <Text style={styles.subtitle}>Track habits with your partner</Text>
        </AnimatedView>

        {/* Animated Form */}
        <AnimatedView style={[styles.form, formStyle]}>
          <FormField label="Email" error={emailError || undefined}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError || undefined}
            />
          </FormField>

          <FormField label="Password" error={passwordError || error || undefined}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={passwordError || error || undefined}
            />
          </FormField>

          {/* Animated Button */}
          <AnimatedView style={buttonStyle}>
            <Button
              title="Sign In"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              size="large"
            />
          </AnimatedView>

          <Pressable onPress={() => router.push('/auth/reset-password')} style={styles.link}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </Pressable>
        </AnimatedView>

        {/* Animated Footer */}
        <AnimatedView style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.push('/auth/sign-up')} style={styles.linkInline}>
            <Text style={styles.linkTextBold}>Sign Up</Text>
          </Pressable>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: Spacing.lg,
  },
  link: {
    alignSelf: 'center',
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
  linkInline: {
    padding: Spacing.xs,
  },
  linkText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  linkTextBold: {
    fontSize: 14,
    color: Colors.green.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
})
