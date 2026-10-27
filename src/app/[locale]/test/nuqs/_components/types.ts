export type Job = {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  description: string;
  salary_min: number;
  salary_max: number;
  location: string;
  workplace: string;
  job_type: string;
  experience_level: string;
  tags: string[];
  apply_url: string;
  is_featured: boolean;
  is_sticky: boolean;
  status: string;
  published_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  company_name: string;
  company_slug: string;
  company_logo_url: string;
  quality_score: number;
  url: string;
};

export type JobResponse = {
  jobs: Job[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
};

export type JobFilters = {
  q?: string | null;
  tags?: string | null; // comma separated list of tags
  location?: string | null;
  workplace?: "remote" | "onsite" | "hybrid" | null;
  type?: "full-time" | "part-time" | "contract" | "freelance" | null;
  level?: "junior" | "mid" | "senior" | "lead" | "principal" | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_floor_min?: number | null; // Strict floor filter — job's minimum salary must be >= this value. Use instead of salary_min when you need guaranteed minimums, not range overlap.
  posted_within_days?: number | null; // Only jobs posted within the last N days (1-90). Useful for polling clients that want fresh-only results. Clamped to 90 server-side.
  limit: number; // Results per page (default 20, max 50)
  page: number;
};

export type Tag = {
  [key: string]: number;
};

export type TagsResponse = {
  tags: Tag;
};

export type Company = {
  slug: string;
  name: string;
  website: string;
  logo_url: string;
  jobs: number;
  avg_salary: number;
  salary_count: number;
};

export type CompaniesResponse = {
  companies: Company[];
  total: number;
};
