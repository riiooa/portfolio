export interface Project {
  id: string
  title: string
  slug: string
  overview: string
  problem_statement: string | null
  tech_stack: string[]
  architecture_image: string | null
  technical_challenge: string | null
  key_metrics: { label: string; value: string }[]
  repo_url: string | null
  demo_url: string | null
  is_featured: boolean
  priority_order: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string
  short_intro: string
  photo_front_url: string | null
  photo_back_metadata: {
    status: string
    role: string
    location: string
    skills: string[]
  }
  updated_at: string
}

export interface AboutContact {
  id: string
  about_logs: { timestamp: string; event: string; message: string }[]
  tech_circuits: { name: string; category: string; connected_to: string[] }[]
  github_url: string | null
  linkedin_url: string | null
  resume_url: string | null
  contact_email: string | null
  updated_at: string
}

export interface Message {
  id: string
  sender_name: string
  sender_email: string
  subject: string
  message: string
  sent_at: string
  is_read: boolean
}
