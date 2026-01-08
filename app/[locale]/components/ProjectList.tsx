'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description?: string;
  visibility: string;
  created_at: string;
  updated_at: string;
}

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  locale: string;
}

export default function ProjectList({ projects, onEdit, onDelete, locale }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; project: Project } | null>(null);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleContextMenu = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  };

  const handleDoubleClick = (project: Project) => {
    onEdit(project);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Close context menu when clicking anywhere
  const handleClickOutside = () => {
    if (contextMenu) closeContextMenu();
  };

  return (
    <div className="project-list" onClick={handleClickOutside}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <p>No projects found. Create your first project to get started!</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="project-card"
              onDoubleClick={() => handleDoubleClick(project)}
              onContextMenu={(e) => handleContextMenu(e, project)}
            >
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className="visibility-badge">{project.visibility}</span>
              </div>
              
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              
              <div className="project-meta">
                <span className="date">Updated: {formatDate(project.updated_at)}</span>
              </div>

              <div className="project-actions">
                <Link href={`/${locale}/projects/manage?id=${project.id}`} className="btn-view">
                  View
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this project?')) {
                      onDelete(project.id);
                    }
                  }}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => {
            onEdit(contextMenu.project);
            closeContextMenu();
          }}>
            ✏️ Edit
          </button>
          <Link href={`/${locale}/projects/manage?id=${contextMenu.project.id}`}>
            👁️ View
          </Link>
          <button onClick={() => {
            if (confirm('Are you sure you want to delete this project?')) {
              onDelete(contextMenu.project.id);
            }
            closeContextMenu();
          }}>
            🗑️ Delete
          </button>
        </div>
      )}

      <style jsx>{`
        .project-list {
          width: 100%;
        }

        .search-bar {
          margin-bottom: 2rem;
        }

        .search-bar input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 1.5rem;
          transition: box-shadow 0.2s;
        }

        .project-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .project-header h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #333;
        }

        .visibility-badge {
          background: #f0f0f0;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #666;
        }

        .project-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-meta {
          font-size: 0.875rem;
          color: #999;
          margin-bottom: 1rem;
        }

        .project-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-view,
        .btn-edit,
        .btn-delete {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .btn-view {
          background: #0070f3;
          color: white;
        }

        .btn-view:hover {
          background: #0051cc;
        }

        .btn-edit {
          background: #f5f5f5;
          color: #333;
        }

        .btn-edit:hover {
          background: #e5e5e5;
        }

        .btn-delete {
          background: #ff4444;
          color: white;
        }

        .btn-delete:hover {
          background: #cc0000;
        }

        .context-menu {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 0.5rem;
          min-width: 150px;
        }

        .context-menu button,
        .context-menu a {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          font-size: 0.9rem;
          color: #333;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .context-menu button:hover,
        .context-menu a:hover {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
}
