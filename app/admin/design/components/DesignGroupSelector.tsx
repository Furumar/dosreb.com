'use client'

import { useEffect, useState } from 'react'

type DesignItem = {
  id: string
  name: string
}

type DesignSubgroup = {
  id: string
  name: string
  design_items: DesignItem[]
}

type DesignGroup = {
  id: string
  name: string
  design_subgroups: DesignSubgroup[]
}

type Props = {
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function DesignGroupSelector({ selected, onChange }: Props) {
  const [groups, setGroups] = useState<DesignGroup[]>([])

  useEffect(() => {
    fetch('/api/design-taxonomy')
      .then(res => res.json())
      .then(data => setGroups(data.groups))
  }, [])

  const toggle = (groupId: string) => {
    if (selected.includes(groupId)) {
      onChange(selected.filter(id => id !== groupId))
    } else {
      onChange([...selected, groupId])
    }
  }

  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group.id} className="border rounded p-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(group.id)}
              onChange={() => toggle(group.id)}
            />
            <span className="font-semibold">{group.name}</span>
          </label>

          {selected.includes(group.id) && (
            <div className="ml-6 mt-2 space-y-1 text-sm text-gray-600">
              {group.design_subgroups.map(sub => (
                <div key={sub.id}>
                  <strong>{sub.name}</strong>
                  <ul className="ml-4 list-disc">
                    {sub.design_items.map(item => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
