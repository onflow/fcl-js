export type NotificationInfo = {
  title: string
  message: string
  icon?: string
  onClick?: () => void
  onDismiss?: () => void
}
