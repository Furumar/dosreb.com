'use client'

import { useEffect, useState } from 'react'
import { getDesignGroups } from '../../../../lib/db/design'

import { DesignGroup } from '@/lib/supabase/types'
import SubgroupList from './SubgroupList'

export default function DesignGroupList() {
  const [groups, setGroups] = useState<DesignGroup[]>([])
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  useEffect(() => {
    getDesignGroups().then(setGroups)
  }, [])

  return (
    <ul className="space-y-4">
      {groups.map(group => (
        <li key={group.id} className="border p-4 rounded">
          <button
            onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
            className="w-full text-left font-semibold"
          >
            {group.name}
          </button>

          {openGroup === group.id && (
            <div className="mt-3 pl-4 border-l">
              <SubgroupList groupId={group.id} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
