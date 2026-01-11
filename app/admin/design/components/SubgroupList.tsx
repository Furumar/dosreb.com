"use client";

import { useEffect, useState } from 'react';
import { getSubgroupsByGroup } from '@/lib/db/design';
import { DesignSubgroup } from '@/lib/supabase/types';

export default function SubgroupList({ groupId }: { groupId: string }) {
  const [subgroups, setSubgroups] = useState<DesignSubgroup[]>([]);

  useEffect(() => {
    getSubgroupsByGroup(groupId).then(setSubgroups);
  }, [groupId]);

  return (
    <ul className="space-y-2">
      {subgroups.map(sub => (
        <li key={sub.id} className="p-2 bg-gray-50 rounded">
          {sub.name}
        </li>
      ))}
    </ul>
  );
}

export {}
