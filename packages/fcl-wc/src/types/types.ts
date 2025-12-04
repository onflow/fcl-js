export type NotificationInfo = {
  title: string
  message: string
  icon?: string
  onClick?: () => void
  onDismiss?: () => void
  // Delay in milliseconds before showing the notification, it's used to debounce rapid notification requests (e.g., pre-authz)
  debounceDelay?: number
}
