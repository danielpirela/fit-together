// Partner badge component
import { StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'

interface PartnerBadgeProps {
  name: string
  avatarUrl?: string
  initials?: string
  isOnline?: boolean
  role?: 'partner_a' | 'partner_b'
}

export function PartnerBadge({
  name,
  avatarUrl,
  initials,
  isOnline = false,
  role,
}: PartnerBadgeProps) {
  const displayInitials =
    initials ||
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        {avatarUrl ? (
          <View style={styles.avatarImage} />
          // In real app: <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.initials}>{displayInitials}</Text>
        )}
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {role && (
          <Text style={styles.role}>{role === 'partner_a' ? 'Partner A' : 'Partner B'}</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  initials: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.green.light,
    borderWidth: 2,
    borderColor: Colors.background.surface,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  role: {
    fontSize: 13,
    color: Colors.gray[500],
    marginTop: 2,
  },
})
