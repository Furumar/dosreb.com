'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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

export default function ProjectsPage() {
  const t = useTranslations('projectsPage');
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
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
  
  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>{t('title')}</h1>
        <p className="page-lead">
          {t('lead')}
        </p>
      </section>

      {/* User's Custom Projects */}
      <section className="page-section" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <h2 className="section-title">Your Construction Projects</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowForm(!showForm);
            }}
            className="btn-primary new-project-btn"
            type="button"
            style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
          >
            {showForm ? 'Cancel' : '+ Add New Project'}
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

      {/* Reference Projects */}
      <section className="page-section">
        <h2 className="section-title">Reference Projects</h2>
      </section>

      <section className="page-section">
        <h3 className="section-title">{t('stockmann.title')}</h3>
        <p>
          {t('stockmann.description1')}
        </p>
        <p>
          {t('stockmann.description2')}
        </p>
        <p className="lumi-comment">
          {t('stockmann.lumiQuote')}
        </p>
        <Link href="/projects/stockmann" className="btn-primary">{t('viewProject')}</Link>
      </section>

      <section className="page-section">
        <h3 className="section-title">{t('dbschenker.title')}</h3>
        <p>
          {t('dbschenker.description')}
        </p>
        <p className="lumi-comment">
          {t('dbschenker.lumiQuote')}
        </p>
        <Link href="/projects/dbschenker" className="btn-primary">{t('viewProject')}</Link>
      </section>

      <section className="page-section">
        <h3 className="section-title">{t('jatkasaari.title')}</h3>
        <p>
          {t('jatkasaari.description')}
        </p>
        <p className="lumi-comment">
          {t('jatkasaari.lumiQuote')}
        </p>
        <Link href="/projects/jatkasaari" className="btn-primary">{t('viewProject')}</Link>
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
