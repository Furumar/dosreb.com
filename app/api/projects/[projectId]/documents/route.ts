import { NextResponse } from 'next/server'
import { db } from '../../../../lib/db/design'
import { cookies } from 'next/headers'
export async function GET(request: Request, { params }: { params: { projectId: string } }) {
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
          name,
          group_id,
          design_groups (
            id,
            name
          )
        )
      ),
      document_versions (
        id,
        version_label,
        file_name,
        storage_path,
        uploaded_at,
        uploaded_by,
        notes
      )
    `)
    .eq('project_id', projectId)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to load documents' }, { status: 500 })
  }

  return NextResponse.json({ documents: data })
}
