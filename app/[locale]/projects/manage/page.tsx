"use client";

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

type FileMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  createdAt: string;
};

type Project = {
  id: string;
  title: string;
  description?: string;
  files: FileMeta[];
  createdAt: string;
};

const STORAGE_KEY = 'dosreb.projects.v1';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function readProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch (e) {
    return [];
  }
}

function writeProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setProjects(readProjects());
  }, []);

  useEffect(() => {
    writeProjects(projects);
  }, [projects]);

  const createProject = () => {
    if (!title.trim()) return;
    const p: Project = { id: uid(), title: title.trim(), files: [], createdAt: new Date().toISOString() };
    setProjects([p, ...projects]);
    setTitle('');
    setSelected(p);
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.files || []);
    handleFiles(items);
  };

  const handleFiles = (files: File[]) => {
    if (!selected) return alert('Select or create a project first');
    const readers: Promise<FileMeta>[] = files.map(f => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = typeof reader.result === 'string' ? reader.result : undefined;
          res({ id: uid(), name: f.name, type: f.type, size: f.size, dataUrl, createdAt: new Date().toISOString() });
        };
        if (f.type.startsWith('image/') || f.type === 'application/pdf') reader.readAsDataURL(f);
        else {
          // for other files, do not read large content - store minimal info
          res({ id: uid(), name: f.name, type: f.type, size: f.size, createdAt: new Date().toISOString() });
        }
      });
    });

    Promise.all(readers).then(metas => {
      const updated = projects.map(p => p.id === selected.id ? { ...p, files: [...metas, ...p.files] } : p);
      setProjects(updated);
      setSelected(updated.find(p => p.id === selected.id) || null);
    });
  };

  const removeFile = (fileId: string) => {
    if (!selected) return;
    const updated = projects.map(p => p.id === selected.id ? { ...p, files: p.files.filter(f => f.id !== fileId) } : p);
    setProjects(updated);
    setSelected(updated.find(p => p.id === selected.id) || null);
  };

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>Project Manager (PoC)</h1>
        <p className="page-lead">A simple local Proof-of-Concept for project creation, drag-and-drop uploads and gallery.</p>
      </section>

      <section className="page-section" style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <h3>Create Project</h3>
          <input placeholder="Project title" value={title} onChange={e => setTitle(e.target.value)} />
          <div style={{ height: '0.5rem' }} />
          <button className="btn-primary" onClick={createProject}>Create</button>

          <h3 style={{ marginTop: '1.5rem' }}>Your Projects</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {projects.map(p => (
              <div key={p.id} className="project-card" style={{ cursor: 'pointer' }} onClick={() => setSelected(p)}>
                <h4 style={{ margin: '0.5rem 0' }}>{p.title}</h4>
                <div style={{ fontSize: '.9rem', color: 'rgba(255,255,255,0.75)' }}>{p.files.length} files</div>
              </div>
            ))}
            {projects.length === 0 && <div>No projects yet</div>}
          </div>
        </div>

        <div style={{ flex: 2 }}>
          <h3>Project Detail</h3>
          {!selected && <div>Select or create a project</div>}
          {selected && (
            <div>
              <h2>{selected.title}</h2>
              <div
                onDrop={dropHandler}
                onDragOver={e => e.preventDefault()}
                style={{ border: '2px dashed rgba(255,215,0,0.2)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' }}
              >
                <div style={{ marginBottom: '.5rem' }}>Drop files here to upload (images/PDFs previewed)</div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <input ref={fileRef} type="file" multiple onChange={e => { if (e.target.files) handleFiles(Array.from(e.target.files)); }} />
                  <button className="btn-secondary" onClick={() => fileRef.current?.click()}>Choose files</button>
                </div>
              </div>

              <div className="project-cards" style={{ marginTop: '1rem' }}>
                {selected.files.map(f => (
                  <div key={f.id} className="project-card" style={{ textAlign: 'left' }}>
                    {f.dataUrl ? (
                      <img src={f.dataUrl} alt={f.name} style={{ width: '100%', borderRadius: '0.75rem' }} />
                    ) : (
                      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.name}</div>
                    )}
                    <h4 style={{ marginTop: '.75rem' }}>{f.name}</h4>
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <a className="btn-primary" href={f.dataUrl || '#'} target="_blank" rel="noreferrer">View</a>
                      <button className="btn-secondary" onClick={() => removeFile(f.id)}>Remove</button>
                    </div>
                  </div>
                ))}
                {selected.files.length === 0 && <div>No files uploaded</div>}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
