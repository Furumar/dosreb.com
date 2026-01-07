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

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
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
    return <div className="dosreb-page">Loading...</div>;
  }

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>Real Estate Portfolio</h1>
        <p className="page-lead">
          Manage your real estate projects, designs, and documentation
        </p>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2 className="section-title">Your Real Estate Projects</h2>
          <button
            onClick={() => {
              console.log('Button clicked, showForm:', showForm);
              setShowForm(!showForm);
            }}
            className="btn-primary"
            type="button"
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
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
}
