"use client";

import DesignGroupList from './components/DesignGroupList';

export default function DesignAdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Suunnittelualat</h1>
      <DesignGroupList />
    </div>
  )
}
