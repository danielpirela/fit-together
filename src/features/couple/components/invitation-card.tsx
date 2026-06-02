// Invitation card component
import { Button } from '@/shared/components/button'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'
import { StyleSheet, Text, View } from 'react-native'

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired'

interface InvitationCardProps {
  inviterName: string
  coupleName: string
  expiresAt: string
  status: InvitationStatus
  onAccept?: () => void
  onDecline?: () => void
}

const STATUS_CONFIG: Record<
  InvitationStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  pending: {
    label: 'Pending',
    bgColor: `${Colors.system.yellow}30`, // Add transparency
    textColor: '#B8860B', // Dark goldenrod
  },
  accepted: {
    label: 'Accepted',
    bgColor: Colors.green.light,
    textColor: Colors.green.dark,
  },
  declined: {
    label: 'Declined',
    bgColor: Colors.gray[100],
    textColor: Colors.gray[600],
  },
  expired: {
    label: 'Expired',
    bgColor: Colors.red.light,
    textColor: Colors.red.dark,
  },
}

export function InvitationCard({
  inviterName,
  coupleName,
  expiresAt,
  status,
  onAccept,
  onDecline,
}: InvitationCardProps) {
  const config = STATUS_CONFIG[status]
  const isPending = status === 'pending'

  // Format expiry date
  const expiryDate = new Date(expiresAt)
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.coupleName}>{coupleName}</Text>
          <Text style={styles.inviter}>Invited by {inviterName}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
          <Text style={[styles.badgeText, { color: config.textColor }]}>{config.label}</Text>
        </View>
      </View>

      <View style={styles.expiryContainer}>
        <Text style={styles.expiryLabel}>Expires: </Text>
        <Text style={styles.expiryDate}>{formattedExpiry}</Text>
      </View>

      {isPending && (
        <View style={styles.actions}>
          {onAccept && (
            <Button
              title="Accept"
              onPress={onAccept}
              variant="primary"
              size="small"
              style={styles.actionButton}
            />
          )}
          {onDecline && (
            <Button
              title="Decline"
              onPress={onDecline}
              variant="ghost"
              size="small"
              style={styles.actionButton}
            />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  coupleName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  inviter: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expiryContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  expiryLabel: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  expiryDate: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
})
