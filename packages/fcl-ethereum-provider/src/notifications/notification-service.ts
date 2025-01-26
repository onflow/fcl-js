export class NotificationsService {
  constructor() {
    this.notifications = []
  }

  addNotification(notification) {
    this.notifications.push(notification)
  }

  getNotifications() {
    return this.notifications
  }

  clearNotifications() {
    this.notifications = []
  }
}
