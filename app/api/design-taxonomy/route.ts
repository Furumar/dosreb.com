import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export async function GET() {
  const { data, error } = await db
    .from('design_groups')
    .select(`
      id,
      name,
      design_subgroups (
        id,
        name,
        design_items (
          id,
          name
        )
      )
    `)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error loading taxonomy:', error)
    return NextResponse.json({ error: 'Failed to load taxonomy' }, { status: 500 })
  }

  return NextResponse.json({ groups: data })
}
