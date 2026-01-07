'use client';

import { useState, useEffect } from 'react';
import ProjectList from '../components/ProjectList';
import ProjectForm, { ProjectFormData } from '../components/ProjectForm';

interface Project {
  id: string;
  title: string;
  description?: string;
  visibility: string;
  created_at: string;
  updated_at: string;
}

export default function RealEstatesPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      console.log('Loading projects...');
      const response = await fetch('/api/projects');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Projects loaded:', data);
      setProjects(data);
      setError(null);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError(error instanceof Error ? error.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await loadProjects();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (!editingProject) return;

    try {
      const response = await fetch(`/api/projects?id=${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await loadProjects();
        setEditingProject(null);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="dosreb-page">
        <section className="page-hero">
          <h1>Loading...</h1>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dosreb-page">
        <section className="page-hero">
          <h1>Error</h1>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={loadProjects} className="btn-primary">
            Retry
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>Real Estate Portfolio</h1>
        <p className="page-lead">
          Manage your real estate projects, designs, and documentation
        </p>
      </section>

      <section className="page-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <h2 className="section-title">Your Real Estate Projects</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked!', { showForm, event: e });
              setShowForm(!showForm);
            }}
            className="btn-primary new-project-btn"
            type="button"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: '2rem' }}>
            <ProjectForm
              onSubmit={handleCreateProject}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {editingProject && (
          <div style={{ marginBottom: '2rem' }}>
            <ProjectForm
              initialData={{
                title: editingProject.title,
                description: editingProject.description || '',
                visibility: editingProject.visibility as any,
              }}
              onSubmit={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        )}

        <ProjectList
          projects={projects}
          onEdit={setEditingProject}
          onDelete={handleDeleteProject}
          locale="en"
        />
      </section>

      <style jsx>{`
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
          position: relative;
          z-index: 10;
        }
        
        :global(.new-project-btn) {
          position: relative !important;
          z-index: 100 !important;
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  );
}
