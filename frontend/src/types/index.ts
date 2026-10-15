export type UserRole = 'citizen' | 'admin';

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export type IssueStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IssueStatusHistoryItem {
  id: number;
  previous_status?: string;
  new_status: IssueStatus;
  changed_by_name?: string;
  note?: string;
  created_at: string;
}

export interface IssueCommentItem {
  id: number;
  user_id: number;
  user_name: string;
  user_role: UserRole;
  message: string;
  created_at: string;
}

export interface PotentialDuplicateItem {
  id: number;
  matched_issue_id: number;
  matched_tracking_id: string;
  matched_title: string;
  matched_category: string;
  matched_status: IssueStatus;
  similarity_score: number;
  review_status: 'Pending' | 'Confirmed Duplicate' | 'Marked Independent';
  created_at: string;
}

export interface Issue {
  id: number;
  tracking_id: string;
  user_id: number;
  reporter_name?: string;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  ai_priority_explanation?: string;
  department: string;
  status: IssueStatus;
  image_path?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  ai_summary?: string;
  admin_notes?: string;
  resolution_details?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface IssueDetail extends Issue {
  status_history: IssueStatusHistoryItem[];
  comments: IssueCommentItem[];
  potential_duplicates: PotentialDuplicateItem[];
}

export interface PublicMapIssue {
  id: number;
  tracking_id: string;
  title: string;
  category: string;
  priority: IssuePriority;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  address?: string;
  created_at: string;
}

export interface IssueListResponse {
  items: Issue[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  issue_id?: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminOverview {
  total_complaints: number;
  unassigned_complaints: number;
  high_critical_complaints: number;
  resolved_complaints: number;
  average_resolution_hours: number;
  pending_duplicates_count: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface PriorityCount {
  priority: string;
  count: number;
}

export interface DepartmentWorkload {
  department: string;
  total: number;
  resolved: number;
  pending: number;
}

export interface MonthlyTrend {
  period: string;
  count: number;
}

export interface AdminAnalytics {
  category_distribution: CategoryCount[];
  status_distribution: StatusCount[];
  priority_distribution: PriorityCount[];
  department_workload: DepartmentWorkload[];
  monthly_trend: MonthlyTrend[];
}

export interface DuplicateBrief {
  id: number;
  tracking_id: string;
  title: string;
  category: string;
  status: IssueStatus;
  priority: IssuePriority;
  address?: string;
  created_at: string;
}

export interface DuplicateRecord {
  id: number;
  source_issue: DuplicateBrief;
  matched_issue: DuplicateBrief;
  similarity_score: number;
  review_status: 'Pending' | 'Confirmed Duplicate' | 'Marked Independent';
  created_at: string;
}

export interface AIClassifyResult {
  category: string;
  priority: IssuePriority;
  priority_explanation: string;
  department: string;
  summary: string;
  is_ai_powered: boolean;
}
