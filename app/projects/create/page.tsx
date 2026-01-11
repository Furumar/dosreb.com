'use client'

import { useState } from 'react'
import DesignGroupSelector from '../../../components/DesignGroupSelector'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CreateProjectPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [designGroups, setDesignGroups] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const createProject = async () => {
    setLoading(true)
    setMessage('')

    // 1. Create the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({ name, description })
      .select()
      .single()

    if (projectError) {
      console.error(projectError)
      setMessage('Failed to create project')
      setLoading(false)
      return
    }

    // 2. Assign selected design groups
    if (designGroups.length > 0) {
      const { error: groupError } = await supabase
        .from('project_design_groups')
        .insert(
          designGroups.map(id => ({
            project_id: project.id,
            design_group_id: id
          }))
        )

      if (groupError) {
        console.error(groupError)
        setMessage('Project created, but failed to assign design groups')
        setLoading(false)
        return
      }
    }

    setMessage('Project created successfully')
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Create Project</h1>

      <div className="space-y-2">
        <label className="font-semibold">Project Name</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Enter project name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Description</label>
        <textarea
          className="border p-2 w-full rounded"
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">Select Design Groups</label>
        <DesignGroupSelector
          selected={designGroups}
          onChange={setDesignGroups}
        />
      </div>

      <button
        onClick={createProject}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>

      {message && (
        <p className="text-green-600 font-semibold mt-4">{message}</p>
      )}
    </div>
  )
}


