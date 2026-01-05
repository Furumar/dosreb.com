'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FileUpload from '../../components/FileUpload';
import FileGallery from '../../components/FileGallery';

interface Project {
  id: string;
  title: string;
  description?: string;
  visibility: string;
}

interface FileRecord {
  id: string;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  metadata: {
    folder?: string;
  };
  created_at: string;
}

export default function ManageProjectPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'documents' | 'designs' | 'photos'>('documents');

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadFiles();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`);
      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const response = await fetch(`/api/files?projectId=${projectId}`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleUploadComplete = (file: FileRecord) => {
    setFiles((prev) => [file, ...prev]);
  };

  const handleDeleteFile = async (fileId: string, storagePath: string) => {
    try {
      const response = await fetch(
        `/api/files?id=${fileId}&storagePath=${encodeURIComponent(storagePath)}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  if (loading) {
    return <div className="dosreb-page">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="dosreb-page">
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>{project.title}</h1>
        {project.description && (
          <p className="page-lead">{project.description}</p>
        )}
      </section>

      <section className="page-section">
        <div className="project-tabs">
          <button
            className={activeTab === 'documents' ? 'active' : ''}
            onClick={() => setActiveTab('documents')}
          >
            📄 Documents
          </button>
          <button
            className={activeTab === 'designs' ? 'active' : ''}
            onClick={() => setActiveTab('designs')}
          >
            🎨 Designs
          </button>
          <button
            className={activeTab === 'photos' ? 'active' : ''}
            onClick={() => setActiveTab('photos')}
          >
            📸 Photos
          </button>
        </div>

        <div className="project-content">
          <div className="upload-section">
            <h3>Upload {activeTab}</h3>
            <FileUpload
              projectId={projectId!}
              folder={activeTab}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          <div className="files-section">
            <FileGallery
              projectId={projectId!}
              files={files}
              onDelete={handleDeleteFile}
              onRefresh={loadFiles}
            />
          </div>
        </div>
      </section>

      <style jsx>{`
        .project-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e5e5;
        }

        .project-tabs button {
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
        }

        .project-tabs button:hover {
          background: #f5f5f5;
        }

        .project-tabs button.active {
          border-bottom-color: #0070f3;
          color: #0070f3;
          font-weight: 500;
        }

        .project-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        .upload-section h3,
        .files-section h3 {
          margin: 0 0 1rem;
          font-size: 1.25rem;
        }

        @media (min-width: 768px) {
          .project-content {
            grid-template-columns: 1fr 2fr;
          }
        }
      `}</style>
    </div>
  );
}    Promise.all(readers).then(metas => {
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
}