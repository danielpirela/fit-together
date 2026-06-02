// Deep link handling utilities for Fit Together app

import * as Linking from 'expo-linking'

export interface InviteDeepLink {
  type: 'invite'
  token: string
}

export type DeepLink = InviteDeepLink

/**
 * Parse a deep link URL into a structured object
 */
export function parseDeepLink(url: string): DeepLink | null {
  try {
    const parsed = Linking.parse(url)

    // Handle invite deep links: fit-together://invite/{token}
    if (parsed.path?.startsWith('invite/')) {
      const token = parsed.path.replace('invite/', '')
      if (token) {
        return { type: 'invite', token }
      }
    }

    // Handle invite deep links with query: fit-together://invite?token=xxx
    if (parsed.path === 'invite' && parsed.queryParams?.token) {
      return { type: 'invite', token: parsed.queryParams.token as string }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Create an invite deep link URL
 */
export function createInviteLink(token: string): string {
  return Linking.createURL(`invite/${token}`)
}

/**
 * Create a reset password deep link URL
 */
export function createResetPasswordLink(): string {
  return Linking.createURL('reset-password')
}

/**
 * Get the base URL for the app
 */
export function getAppBaseUrl(): string {
  return Linking.createURL('')
}

/**
 * Check if a URL is a deep link to this app
 */
export function isDeepLink(url: string): boolean {
  return (
    url.startsWith('fit-together://') ||
    url.startsWith('fittogether://') ||
    url.startsWith('https://fittogether.app') ||
    url.startsWith('https://*.fittogether.app')
  )
}
