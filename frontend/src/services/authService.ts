import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: { full_name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('civicai_token');
    localStorage.removeItem('civicai_user');
  }
};
