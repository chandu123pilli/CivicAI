import api from './api';
import { NotificationItem } from '../types';

export const notificationService = {
  async getNotifications(limit: number = 20): Promise<NotificationItem[]> {
    const res = await api.get<NotificationItem[]>('/notifications', { params: { limit } });
    return res.data;
  },

  async markAsRead(id: number): Promise<NotificationItem> {
    const res = await api.patch<NotificationItem>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },
};
