import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// GET all projects
export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('priority_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create project
export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...body, slug })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
