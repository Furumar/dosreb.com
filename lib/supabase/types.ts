export type DesignGroup = {
  id: string
  name: string
  created_at: string
}

export {}
export type DesignSubgroup = {
  id: string
  group_id: string
  name: string
  created_at: string
}

export type DesignItem = {
  id: string
  subgroup_id: string
  name: string
  created_at: string
}

export type Project = {
  id: string
  name: string
  description: string | null
  created_at: string
  design_groups?: ProjectDesignGroup[] // ← Add this line
}

export type ProjectDesignGroup = {
  id: string
  project_id: string
  design_group_id: string
  created_at: string
}
