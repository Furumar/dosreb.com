import { NextResponse } from 'next/server'
// Update the import path if necessary, or create the module at '../../../lib/db.ts'
// If your db utility is in 'lib/db.ts', update the import as follows:
import { getDesignGroups } from '../../../lib/db'
export async function GET() {
  try {
    const data = await getDesignGroups();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (error) {
    console.error('Error loading taxonomy:', error)
    return NextResponse.json({ error: 'Failed to load taxonomy' }, { status: 500 })
  }

  return NextResponse.json({ groups: data })
}
