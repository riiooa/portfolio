import { supabase } from '@/lib/supabase'
import Navigation from '@/components/public/Navigation'
import LandingSection from '@/components/public/landing/LandingSection'
import ProjectsSection from '@/components/public/projects/ProjectsSection'
import AboutSection from '@/components/public/about/AboutSection'
import type { Profile, Project, AboutContact } from '@/types'

export const revalidate = 60 // Revalidate every 60 seconds

async function getData() {
  const [profileRes, projectsRes, aboutRes] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('projects').select('*').order('priority_order', { ascending: true }),
    supabase.from('about_contact').select('*').single(),
  ])

  return {
    profile: profileRes.data as Profile | null,
    projects: (projectsRes.data as Project[]) || [],
    about: aboutRes.data as AboutContact | null,
  }
}

export default async function HomePage() {
  const { profile, projects, about } = await getData()

  return (
    <>
      <Navigation />
      <LandingSection profile={profile} />
      <ProjectsSection projects={projects} />
      <AboutSection about={about} />
    </>
  )
}
