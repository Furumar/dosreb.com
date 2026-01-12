import { db } from '../../../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId

  const { data, error } = await db
    .from('documents')
    .select(`
      id,
      file_name,
      file_type,
      file_size,
      storage_path,
      title,
      description,
      version,
      uploaded_by,
      uploaded_at,
      design_items (
        id,
        name,
        subgroup_id,
        design_subgroups (
          id,
          name
        )
      )
    `)
    .eq('project_id', projectId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ documents: data }, { status: 200 })
}
