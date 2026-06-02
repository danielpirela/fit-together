// Activity grid component
// 12-month calendar grid showing completion history

import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { GridLayout, Spacing } from '@/shared/constants/theme-spacing'
import { DiagonalGridCell, SolidGridCell } from './grid-cell'
import { GridLegend } from './grid-legend'

export type ViewMode = 'couple' | 'personal'

interface SharedCompletion {
  date: string
  partnerACompleted: boolean
  partnerBCompleted: boolean
}

interface ActivityGridProps {
  habitId: string
  completions: SharedCompletion[]
  viewMode: ViewMode
  targetDays?: number[] // 0=Sun, 1=Mon, ..., 6=Sat
  months?: number
}

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function ActivityGrid({
  completions,
  viewMode,
  targetDays = [1, 3, 5], // Default Mon, Wed, Fri
  months = 12,
}: ActivityGridProps) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setMonth(startDate.getMonth() - months + 1)
    startDate.setDate(1)

    // Create completion map
    const completionMap = new Map<string, SharedCompletion>()
    completions.forEach((c) => completionMap.set(c.date, c))

    // Generate weeks
    const weeks: { date: string; dayOfWeek: number }[][] = []
    let currentWeek: { date: string; dayOfWeek: number }[] = []
    const monthLabels: { label: string; weekIndex: number }[] = []

    const currentDate = new Date(startDate)
    let lastMonth = -1
    let weekIndex = 0

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayOfWeek = currentDate.getDay()

      // Track month changes for labels
      if (currentDate.getMonth() !== lastMonth) {
        if (lastMonth !== -1) {
          monthLabels.push({
            label: MONTH_NAMES[currentDate.getMonth()],
            weekIndex,
          })
        }
        lastMonth = currentDate.getMonth()
      }

      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
        weekIndex++
      }

      currentWeek.push({ date: dateStr, dayOfWeek })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return { weeks, monthLabels, completionMap }
  }, [completions, months])

  const getCellStatus = (dateStr: string, _dayOfWeek: number) => {
    const completion = completions.find((c) => c.date === dateStr)
    if (!completion) return 'none'
    if (viewMode === 'personal') {
      return completion.partnerACompleted ? 'mine' : 'none'
    }
    // Couple view
    if (completion.partnerACompleted && completion.partnerBCompleted) return 'both'
    if (completion.partnerACompleted) return 'mine'
    if (completion.partnerBCompleted) return 'partner'
    return 'none'
  }

  const isTargetDay = (dayOfWeek: number) => targetDays.includes(dayOfWeek)

  return (
    <View style={styles.container}>
      {/* Month labels */}
      <View style={styles.monthLabels}>
        {monthLabels.map((month, i) => (
          <Text
            key={`${month.label}-${i}`}
            style={[
              styles.monthLabel,
              { left: month.weekIndex * (GridLayout.cellSize + GridLayout.cellGap) },
            ]}
          >
            {month.label}
          </Text>
        ))}
      </View>

      <View style={styles.gridContainer}>
        {/* Day of week labels */}
        <View style={styles.dayLabels}>
          {DAYS_OF_WEEK.map((day, i) => (
            <Text key={i} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.grid}>
            {weeks.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {DAYS_OF_WEEK.map((_, dayIndex) => {
                  const dayData = week.find((d) => d.dayOfWeek === dayIndex)
                  if (!dayData) {
                    return <View key={dayIndex} style={styles.emptyCell} />
                  }

                  const status = getCellStatus(dayData.date, dayIndex)
                  const isTarget = isTargetDay(dayIndex)
                  const isFuture = new Date(dayData.date) > new Date()

                  if (!isTarget) {
                    return (
                      <View
                        key={dayIndex}
                        style={[
                          styles.cell,
                          { width: GridLayout.cellSize, height: GridLayout.cellSize },
                        ]}
                      />
                    )
                  }

                  if (isFuture) {
                    return (
                      <SolidGridCell
                        key={dayIndex}
                        color={Colors.gray[50]}
                        size={GridLayout.cellSize}
                      />
                    )
                  }

                  if (status === 'both') {
                    return (
                      <DiagonalGridCell
                        key={dayIndex}
                        size={GridLayout.cellSize}
                        topLeftColor={Colors.green.primary}
                        bottomRightColor={Colors.purple.primary}
                      />
                    )
                  }

                  return (
                    <SolidGridCell
                      key={dayIndex}
                      color={
                        status === 'mine'
                          ? Colors.green.primary
                          : status === 'partner'
                            ? Colors.purple.primary
                            : Colors.gray[100]
                      }
                      size={GridLayout.cellSize}
                    />
                  )
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Legend */}
      <GridLegend />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  monthLabels: {
    height: 20,
    position: 'relative',
    marginBottom: Spacing.xs,
  },
  monthLabel: {
    position: 'absolute',
    fontSize: 10,
    color: Colors.gray[400],
  },
  gridContainer: {
    flexDirection: 'row',
  },
  dayLabels: {
    marginRight: Spacing.xs,
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 10,
    color: Colors.gray[400],
    height: GridLayout.cellSize + GridLayout.cellGap,
    lineHeight: GridLayout.cellSize + GridLayout.cellGap,
  },
  grid: {
    flexDirection: 'row',
    gap: GridLayout.cellGap,
  },
  weekColumn: {
    flexDirection: 'column',
    gap: GridLayout.cellGap,
  },
  cell: {
    borderRadius: 2,
  },
  emptyCell: {
    width: GridLayout.cellSize,
    height: GridLayout.cellSize,
  },
})
