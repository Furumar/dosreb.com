'use client'

import { useEffect, useState } from 'react'
import { DesignGroup, ProjectDesignGroup } from '@/lib/supabase/types'
import { getDesignGroups, addDesignGroupToProject, removeDesignGroupFromProject } from '@/lib/db/design'

type Props = {
  projectId: string
  assignedGroups: ProjectDesignGroup[]
}

export default function DesignGroupAssignment({ projectId, assignedGroups }: Props) {
  const [groups, setGroups] = useState<DesignGroup[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadGroups() {
      const allGroups = await getDesignGroups()
      setGroups(allGroups)
    }
    loadGroups()
  }, [])

  const isAssigned = (groupId: string) =>
    assignedGroups.some(g => g.design_group_id === groupId)

  const toggleGroup = async (groupId: string) => {
    setLoading(true)
    try {
      if (isAssigned(groupId)) {
        await removeDesignGroupFromProject(projectId, groupId)
      } else {
        await addDesignGroupToProject(projectId, groupId)
      }
      // Refresh logic here if needed
    } catch (error) {
      console.error('Error updating group assignment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Assign Design Groups</h3>
      <ul className="space-y-2">
        {groups.map(group => (
          <li key={group.id} className="flex items-center justify-between">
            <span>{group.name}</span>
            <button
              onClick={() => toggleGroup(group.id)}
              disabled={loading}
              className={`px-3 py-1 rounded ${
                isAssigned(group.id) ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
            >
              {isAssigned(group.id) ? 'Remove' : 'Add'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
