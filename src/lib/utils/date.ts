import { format, formatDistanceToNow, isAfter, isBefore, isToday, isYesterday, isTomorrow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * Format date to Chinese format
 * @param date - Date to format
 * @param pattern - Format pattern (default: 'yyyy年M月d日')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, pattern = 'yyyy年M月d日'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, pattern, { locale: zhCN })
}

/**
 * Format datetime to Chinese format with time
 * @param date - Date to format
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'yyyy年M月d日 HH:mm')
}

/**
 * Format time only
 * @param date - Date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'HH:mm')
}

/**
 * Get relative time string (e.g., "3分钟前")
 * @param date - Date to compare
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { locale: zhCN, addSuffix: true })
}

/**
 * Get friendly date display (Today, Yesterday, Tomorrow, or formatted date)
 * @param date - Date to format
 * @returns Friendly date string
 */
export function formatFriendlyDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return '今天'
  }
  if (isYesterday(dateObj)) {
    return '昨天'
  }
  if (isTomorrow(dateObj)) {
    return '明天'
  }

  return formatDate(dateObj)
}

/**
 * Check if date is overdue (before now)
 * @param date - Date to check
 * @returns True if overdue
 */
export function isOverdue(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return isBefore(dateObj, new Date())
}

/**
 * Check if date is in the future
 * @param date - Date to check
 * @returns True if in future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return isAfter(dateObj, new Date())
}

/**
 * Get date display with urgency indicator
 * @param date - Due date
 * @returns Object with formatted date and urgency level
 */
export function getDueDateDisplay(date: Date | string): {
  text: string
  urgency: 'overdue' | 'urgent' | 'soon' | 'normal'
} {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const daysUntilDue = Math.floor((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (isOverdue(dateObj)) {
    return {
      text: formatFriendlyDate(dateObj),
      urgency: 'overdue',
    }
  }
  if (daysUntilDue <= 0) {
    return {
      text: '今天',
      urgency: 'urgent',
    }
  }
  if (daysUntilDue <= 1) {
    return {
      text: '明天',
      urgency: 'urgent',
    }
  }
  if (daysUntilDue <= 3) {
    return {
      text: formatDate(dateObj, 'M月d日'),
      urgency: 'soon',
    }
  }

  return {
    text: formatDate(dateObj, 'M月d日'),
    urgency: 'normal',
  }
}

/**
 * Format duration in minutes to human readable format
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) {
    return `${hours}小时`
  }
  return `${hours}小时${remainingMinutes}分钟`
}

/**
 * Parse duration string to minutes
 * @param duration - Duration string (e.g., "2小时30分钟" or "90分钟")
 * @returns Duration in minutes
 */
export function parseDuration(duration: string): number {
  let total = 0
  const hourMatch = duration.match(/(\d+)\s*小时/)
  const minuteMatch = duration.match(/(\d+)\s*分钟/)

  if (hourMatch) {
    total += Number.parseInt(hourMatch[1], 10) * 60
  }
  if (minuteMatch) {
    total += Number.parseInt(minuteMatch[1], 10)
  }

  return total
}
