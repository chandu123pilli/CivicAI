import api from './api';
import { AdminOverview, AdminAnalytics, DuplicateRecord, Issue } from '../types';

export const adminService = {
  async getOverview(): Promise<AdminOverview> {
    const res = await api.get<AdminOverview>('/admin/overview');
    return res.data;
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    const res = await api.get<AdminAnalytics>('/admin/analytics');
    return res.data;
  },

  async updateIssueStatus(
    issueId: number,
    data: {
      new_status: string;
      note?: string;
      resolution_details?: string;
      priority?: string;
      department?: string;
    }
  ): Promise<Issue> {
    const res = await api.patch<Issue>(`/admin/issues/${issueId}/status`, data);
    return res.data;
  },

  async assignDepartment(
    issueId: number,
    data: { department: string; note?: string }
  ): Promise<Issue> {
    const res = await api.patch<Issue>(`/admin/issues/${issueId}/assign`, data);
    return res.data;
  },

  async getDuplicates(statusFilter?: string): Promise<DuplicateRecord[]> {
    const res = await api.get<DuplicateRecord[]>('/admin/duplicates', {
      params: { status_filter: statusFilter },
    });
    return res.data;
  },

  async updateDuplicateStatus(
    duplicateId: number,
    reviewStatus: 'Confirmed Duplicate' | 'Marked Independent'
  ): Promise<DuplicateRecord> {
    const res = await api.patch<DuplicateRecord>(`/admin/duplicates/${duplicateId}`, {
      review_status: reviewStatus,
    });
    return res.data;
  },
};
