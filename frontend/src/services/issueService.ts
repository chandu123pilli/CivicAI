import api from './api';
import { Issue, IssueDetail, IssueListResponse, PublicMapIssue, IssueCommentItem, IssueStatusHistoryItem } from '../types';

export interface IssueFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  priority?: string;
  department?: string;
  search?: string;
  my_reports_only?: boolean;
}

export const issueService = {
  async createIssue(formData: FormData): Promise<Issue> {
    const res = await api.post<Issue>('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getIssues(params: IssueFilterParams = {}): Promise<IssueListResponse> {
    const res = await api.get<IssueListResponse>('/issues', { params });
    return res.data;
  },

  async getIssueDetail(id: number): Promise<IssueDetail> {
    const res = await api.get<IssueDetail>(`/issues/${id}`);
    return res.data;
  },

  async getPublicMapIssues(category?: string, status?: string): Promise<PublicMapIssue[]> {
    const res = await api.get<PublicMapIssue[]>('/issues/public/map', {
      params: { category, status },
    });
    return res.data;
  },

  async updateCitizenIssue(id: number, data: { title?: string; description?: string; address?: string }): Promise<Issue> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.address) formData.append('address', data.address);
    const res = await api.patch<Issue>(`/issues/${id}`, formData);
    return res.data;
  },

  async getIssueHistory(id: number): Promise<IssueStatusHistoryItem[]> {
    const res = await api.get<IssueStatusHistoryItem[]>(`/issues/${id}/history`);
    return res.data;
  },

  async postComment(id: number, message: string): Promise<IssueCommentItem> {
    const res = await api.post<IssueCommentItem>(`/issues/${id}/comments`, { message });
    return res.data;
  },
};
