import { NextResponse } from 'next/server'
// Update the import path if necessary, or create the module at '../../../lib/db.ts'
// If your db utility is in 'lib/db.ts', update the import as follows:
// Update the path below to match the actual location of your db utility.
// For example, if your db utility is at 'lib/db.ts', use:
import { db } from '../../../lib/db/design'
// Or, if it's at 'lib/db/index.ts', use:
//// import { db } from '../../../../../lib/db/index'
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
