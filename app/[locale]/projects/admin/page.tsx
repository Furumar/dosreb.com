'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FileUpload from '../../components/FileUpload';
import FileGallery from '../../components/FileGallery';
import DesignGroupAssignment from '@/app/admin/design/components/DesignGroupAssignment';

type AdminTab = 'reference-photos' | 'projects' | 'real-estates';
type ReferenceProject = 'stockmann' | 'dbschenker' | 'jatkasaari';

interface ProjectFile {
  name: string;
  url: string;
  path: string;
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

interface Project {
  id: string;
  title: string;
  description: string;
  visibility: string;
  created_at: string;
}

interface RealEstate {
  id: string;
  title: string;
  description: string;
  location: string;
  size?: string;
  price?: string;
  status?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('reference-photos');
  const [message, setMessage] = useState('');
  
  // Reference Photos State
  const [selectedProject, setSelectedProject] = useState<ReferenceProject>('stockmann');
  const [uploading, setUploading] = useState(false);
  const [existingFiles, setExistingFiles] = useState<ProjectFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', visibility: 'public' });
  
  // Real Estates State
  const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
  const [loadingRealEstates, setLoadingRealEstates] = useState(false);
  const [editingRealEstate, setEditingRealEstate] = useState<RealEstate | null>(null);
  const [newRealEstate, setNewRealEstate] = useState({ 
    title: '', 
    description: '', 
    location: '', 
    size: '', 
    price: '', 
    status: 'available' 
  });
  const [selectedRealEstate, setSelectedRealEstate] = useState<string | null>(null);
  const [realEstateFiles, setRealEstateFiles] = useState<FileRecord[]>([]);
  const [uploadingRealEstateFile, setUploadingRealEstateFile] = useState(false);
  const [activeFileTab, setActiveFileTab] = useState<'documents' | 'designs' | 'photos'>('photos');

  const projectNames = {
    stockmann: 'Stockmann',
    dbschenker: 'DB Schenker',
    jatkasaari: 'Jätkäsaaren maanalaiset tilat'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'dosreb2026admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'reference-photos') loadExistingFiles();
      else if (activeTab === 'projects') loadProjects();
      else if (activeTab === 'real-estates') loadRealEstates();
    }
  }, [isAuthenticated, selectedProject, activeTab]);

  // Reference Photos Functions
  const loadExistingFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await fetch(`/api/files?project=${selectedProject}&folder=photos`);
      if (response.ok) {
        const data = await response.json();
        setExistingFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage('');
    const uploaded: string[] = [];
    const errors: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('project', selectedProject);
        formData.append('folder', 'photos');

        const response = await fetch('/api/reference-projects/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          uploaded.push(file.name);
        } else {
          const errorData = await response.json();
          errors.push(`${file.name}: ${errorData.details || errorData.error}`);
        }
      }

      if (uploaded.length > 0) {
        setMessage(`✓ Successfully uploaded ${uploaded.length} image(s)`);
        loadExistingFiles();
      }
      if (errors.length > 0) {
        setMessage(prev => prev + '\n\n✗ Errors:\n' + errors.join('\n'));
      }
      e.target.value = '';
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (filePath: string, fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return;
    try {
      const response = await fetch(`/api/reference-projects/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath }),
      });
      if (response.ok) {
        setMessage(`✓ Deleted ${fileName}`);
        loadExistingFiles();
      } else {
        const errorData = await response.json();
        setMessage(`✗ Failed: ${errorData.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Projects Functions
  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      setMessage('✗ Title required');
      return;
    }
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      if (response.ok) {
        setMessage('✓ Project created');
        setNewProject({ title: '', description: '', visibility: 'public' });
        loadProjects();
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    try {
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });
      if (response.ok) {
        setMessage('✓ Project updated');
        setEditingProject(null);
        loadProjects();
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage(`✓ Deleted "${title}"`);
        loadProjects();
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Real Estates Functions
  const loadRealEstates = async () => {
    setLoadingRealEstates(true);
    try {
      const response = await fetch('/api/real-estates');
      if (response.ok) {
        const data = await response.json();
        setRealEstates(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading real estates:', error);
    } finally {
      setLoadingRealEstates(false);
    }
  };

  const handleCreateRealEstate = async () => {
    if (!newRealEstate.title.trim() || !newRealEstate.location.trim()) {
      setMessage('✗ Title and location required');
      return;
    }
    try {
      const response = await fetch('/api/real-estates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRealEstate),
      });
      if (response.ok) {
        setMessage('✓ Real estate created');
        setNewRealEstate({ title: '', description: '', location: '', size: '', price: '', status: 'available' });
        loadRealEstates();
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUpdateRealEstate = async () => {
    if (!editingRealEstate) return;
    try {
      const response = await fetch('/api/real-estates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRealEstate),
      });
      if (response.ok) {
        setMessage('✓ Real estate updated');
        setEditingRealEstate(null);
        loadRealEstates();
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteRealEstate = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const response = await fetch(`/api/real-estates?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage(`✓ Deleted "${title}"`);
        loadRealEstates();
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Real Estate File Management Functions
  const loadRealEstateFiles = async (realEstateId: string) => {
    setUploadingRealEstateFile(true);
    try {
      const response = await fetch(`/api/files?projectId=${realEstateId}`);
      if (response.ok) {
        const files = await response.json();
        setRealEstateFiles(files);
      }
    } catch (error) {
      console.error('Error loading real estate files:', error);
    } finally {
      setUploadingRealEstateFile(false);
    }
  };

  const handleRealEstateFileUpload = async () => {
    if (!selectedRealEstate) return;
    await loadRealEstateFiles(selectedRealEstate);
    setMessage('✓ Files uploaded successfully');
  };

  const handleDeleteRealEstateFile = async (storagePath: string, fileId: string) => {
    if (!confirm(`Delete this file?`)) return;
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });
      if (response.ok) {
        setMessage(`✓ File deleted`);
        if (selectedRealEstate) {
          await loadRealEstateFiles(selectedRealEstate);
        }
      } else {
        const error = await response.json();
        setMessage(`✗ Failed: ${error.error}`);
      }
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dosreb-page">
        <section className="page-hero">
          <h1>Admin Login</h1>
          <p className="page-lead">Enter password to access admin panel</p>
        </section>
        <section className="page-section">
          <form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                background: 'rgba(255, 215, 0, 0.08)',
                color: '#ffd700',
                fontSize: '1rem'
              }}
            />
            {authError && <p style={{ color: '#f00', marginBottom: '1rem' }}>{authError}</p>}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                color: '#000',
                fontWeight: 600,
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          </form>
        </section>
      </div>
    );
  }

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>DOSREB Admin Dashboard</h1>
        <p className="page-lead">Manage all content on dosreb.com</p>
      </section>

      {/* Tabs */}
      <section className="page-section">
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid rgba(255, 215, 0, 0.2)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('reference-photos')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'reference-photos' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'reference-photos' ? '3px solid #ffd700' : '3px solid transparent',
              color: activeTab === 'reference-photos' ? '#ffd700' : 'rgba(255, 251, 230, 0.7)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '-2px'
            }}
          >
            📸 Reference Photos
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'projects' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'projects' ? '3px solid #ffd700' : '3px solid transparent',
              color: activeTab === 'projects' ? '#ffd700' : 'rgba(255, 251, 230, 0.7)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '-2px'
            }}
          >
            🏗️ Projects
          </button>
          <button
            onClick={() => setActiveTab('real-estates')}
            style={{
              padding: '1rem 2rem',
              background: activeTab === 'real-estates' ? 'rgba(255, 215, 0, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'real-estates' ? '3px solid #ffd700' : '3px solid transparent',
              color: activeTab === 'real-estates' ? '#ffd700' : 'rgba(255, 251, 230, 0.7)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '-2px'
            }}
          >
            🏢 Real Estates
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            background: message.includes('✓') ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
            border: `1px solid ${message.includes('✓') ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
            color: message.includes('✓') ? '#0f0' : '#f00',
            whiteSpace: 'pre-wrap'
          }}>
            {message}
          </div>
        )}

        {/* Reference Photos Tab */}
        {activeTab === 'reference-photos' && (
          <div>
            <h2 className="section-title">Manage Reference Project Photos</h2>
            
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value as ReferenceProject)}
              style={{
                background: 'rgba(255, 215, 0, 0.08)',
                color: '#ffd700',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                marginBottom: '2rem',
                cursor: 'pointer'
              }}
            >
              <option value="stockmann">Stockmann</option>
              <option value="dbschenker">DB Schenker</option>
              <option value="jatkasaari">Jätkäsaaren maanalaiset tilat</option>
            </select>

            <label 
              htmlFor="file-upload"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                color: '#000',
                fontWeight: 600,
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.6 : 1,
                marginBottom: '2rem'
              }}
            >
              {uploading ? 'Uploading...' : '📁 Upload Images'}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />

            <h3 style={{ color: '#ffd700', marginTop: '2rem', marginBottom: '1rem' }}>
              Current Photos for {projectNames[selectedProject]}
            </h3>
            {loadingFiles ? (
              <p style={{ color: 'rgba(255, 251, 230, 0.7)' }}>Loading...</p>
            ) : existingFiles.length === 0 ? (
              <p style={{ color: 'rgba(255, 251, 230, 0.7)' }}>No photos uploaded yet.</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {existingFiles.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 215, 0, 0.05)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}
                  >
                    <div style={{ position: 'relative', height: '150px', marginBottom: '0.5rem', borderRadius: '0.5rem', overflow: 'hidden' }}>
                      <Image src={file.url} alt={file.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255, 251, 230, 0.7)', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                      {file.name}
                    </p>
                    <button
                      onClick={() => handleDeleteFile(file.path, file.name)}
                      style={{
                        width: '100%',
                        padding: '0.4rem',
                        background: 'rgba(255, 0, 0, 0.8)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0.3rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <h2 className="section-title">Manage Projects</h2>
            
            <div style={{
              background: 'rgba(255, 215, 0, 0.05)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <input
                type="text"
                placeholder="Project Title"
                value={editingProject ? editingProject.title : newProject.title}
                onChange={(e) => editingProject 
                  ? setEditingProject({...editingProject, title: e.target.value})
                  : setNewProject({...newProject, title: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700'
                }}
              />
              <textarea
                placeholder="Description"
                value={editingProject ? editingProject.description : newProject.description}
                onChange={(e) => editingProject 
                  ? setEditingProject({...editingProject, description: e.target.value})
                  : setNewProject({...newProject, description: e.target.value})
                }
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              <select
                value={editingProject ? editingProject.visibility : newProject.visibility}
                onChange={(e) => editingProject 
                  ? setEditingProject({...editingProject, visibility: e.target.value})
                  : setNewProject({...newProject, visibility: e.target.value})
                }
                style={{
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700',
                  marginRight: '1rem'
                }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                    color: '#000',
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
                {editingProject && (
                  <button
                    onClick={() => setEditingProject(null)}
                    style={{
                      padding: '0.75rem 2rem',
                      background: 'rgba(255, 0, 0, 0.2)',
                      color: '#ffd700',
                      fontWeight: 600,
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Existing Projects</h3>
            {loadingProjects ? (
              <p>Loading...</p>
            ) : projects.length === 0 ? (
              <p style={{ color: 'rgba(255, 251, 230, 0.7)' }}>No projects yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map(project => (
                  <div
                    key={project.id}
                    style={{
                      background: 'rgba(255, 215, 0, 0.05)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}
                  >
                    <DesignGroupAssignment
                      projectId={project.id}
                      assignedGroups={project.design_groups ?? []}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>{project.title}</h4>
                      <p style={{ color: 'rgba(255, 251, 230, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        {project.description}
                      </p>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        background: project.visibility === 'public' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                        borderRadius: '1rem',
                        fontSize: '0.8rem',
                        color: '#ffd700'
                      }}>
                        {project.visibility}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setEditingProject(project)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 215, 0, 0.2)',
                          color: '#ffd700',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                          borderRadius: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 0, 0, 0.2)',
                          color: '#fff',
                          border: '1px solid rgba(255, 0, 0, 0.3)',
                          borderRadius: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Real Estates Tab */}
        {activeTab === 'real-estates' && (
          <div>
            <h2 className="section-title">Manage Real Estates</h2>
            
            <div style={{
              background: 'rgba(255, 215, 0, 0.05)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>
                {editingRealEstate ? 'Edit Real Estate' : 'Create New Real Estate'}
              </h3>
              <input
                type="text"
                placeholder="Title"
                value={editingRealEstate ? editingRealEstate.title : newRealEstate.title}
                onChange={(e) => editingRealEstate 
                  ? setEditingRealEstate({...editingRealEstate, title: e.target.value})
                  : setNewRealEstate({...newRealEstate, title: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700'
                }}
              />
              <input
                type="text"
                placeholder="Location"
                value={editingRealEstate ? editingRealEstate.location : newRealEstate.location}
                onChange={(e) => editingRealEstate 
                  ? setEditingRealEstate({...editingRealEstate, location: e.target.value})
                  : setNewRealEstate({...newRealEstate, location: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700'
                }}
              />
              <textarea
                placeholder="Description"
                value={editingRealEstate ? editingRealEstate.description : newRealEstate.description}
                onChange={(e) => editingRealEstate 
                  ? setEditingRealEstate({...editingRealEstate, description: e.target.value})
                  : setNewRealEstate({...newRealEstate, description: e.target.value})
                }
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Size (e.g., 1000 m²)"
                  value={editingRealEstate ? editingRealEstate.size || '' : newRealEstate.size}
                  onChange={(e) => editingRealEstate 
                    ? setEditingRealEstate({...editingRealEstate, size: e.target.value})
                    : setNewRealEstate({...newRealEstate, size: e.target.value})
                  }
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    background: 'rgba(255, 215, 0, 0.08)',
                    color: '#ffd700'
                  }}
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={editingRealEstate ? editingRealEstate.price || '' : newRealEstate.price}
                  onChange={(e) => editingRealEstate 
                    ? setEditingRealEstate({...editingRealEstate, price: e.target.value})
                    : setNewRealEstate({...newRealEstate, price: e.target.value})
                  }
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    background: 'rgba(255, 215, 0, 0.08)',
                    color: '#ffd700'
                  }}
                />
                <select
                  value={editingRealEstate ? editingRealEstate.status || 'available' : newRealEstate.status}
                  onChange={(e) => editingRealEstate 
                    ? setEditingRealEstate({...editingRealEstate, status: e.target.value})
                    : setNewRealEstate({...newRealEstate, status: e.target.value})
                  }
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    background: 'rgba(255, 215, 0, 0.08)',
                    color: '#ffd700'
                  }}
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={editingRealEstate ? handleUpdateRealEstate : handleCreateRealEstate}
                  style={{
                    padding: '0.75rem 2rem',
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                    color: '#000',
                    fontWeight: 600,
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {editingRealEstate ? 'Update' : 'Create'} Real Estate
                </button>
                {editingRealEstate && (
                  <button
                    onClick={() => setEditingRealEstate(null)}
                    style={{
                      padding: '0.75rem 2rem',
                      background: 'rgba(255, 0, 0, 0.2)',
                      color: '#ffd700',
                      fontWeight: 600,
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Existing Real Estates</h3>
            {loadingRealEstates ? (
              <p>Loading...</p>
            ) : realEstates.length === 0 ? (
              <p style={{ color: 'rgba(255, 251, 230, 0.7)' }}>No real estates yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {realEstates.map(estate => (
                  <div
                    key={estate.id}
                    style={{
                      background: 'rgba(255, 215, 0, 0.05)',
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>{estate.title}</h4>
                      <p style={{ color: 'rgba(255, 251, 230, 0.8)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        📍 {estate.location}
                      </p>
                      <p style={{ color: 'rgba(255, 251, 230, 0.7)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        {estate.description}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'rgba(255, 251, 230, 0.7)' }}>
                        {estate.size && <span>📏 {estate.size}</span>}
                        {estate.price && <span>💰 {estate.price}</span>}
                        {estate.status && (
                          <span style={{ 
                            padding: '0.25rem 0.75rem',
                            background: estate.status === 'available' ? 'rgba(0, 255, 0, 0.2)' : estate.status === 'sold' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                            borderRadius: '1rem'
                          }}>
                            {estate.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedRealEstate(estate.id);
                          loadRealEstateFiles(estate.id);
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(100, 149, 237, 0.2)',
                          color: '#6495ED',
                          border: '1px solid rgba(100, 149, 237, 0.3)',
                          borderRadius: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        📁 Files
                      </button>
                      <button
                        onClick={() => setEditingRealEstate(estate)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 215, 0, 0.2)',
                          color: '#ffd700',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                          borderRadius: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRealEstate(estate.id, estate.title)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(255, 0, 0, 0.2)',
                          color: '#fff',
                          border: '1px solid rgba(255, 0, 0, 0.3)',
                          borderRadius: '0.3rem',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Real Estate File Management Panel */}
            {selectedRealEstate && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(100, 149, 237, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(100, 149, 237, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#6495ED' }}>
                    📁 Manage Files: {realEstates.find(e => e.id === selectedRealEstate)?.title}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedRealEstate(null);
                      setRealEstateFiles([]);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 0, 0, 0.2)',
                      color: '#fff',
                      border: '1px solid rgba(255, 0, 0, 0.3)',
                      borderRadius: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Close
                  </button>
                </div>

                {/* File Type Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(100, 149, 237, 0.3)', paddingBottom: '0.5rem' }}>
                  {(['photos', 'documents', 'designs'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveFileTab(tab)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: activeFileTab === tab ? 'rgba(100, 149, 237, 0.3)' : 'transparent',
                        color: activeFileTab === tab ? '#6495ED' : 'rgba(255, 251, 230, 0.7)',
                        border: activeFileTab === tab ? '1px solid rgba(100, 149, 237, 0.5)' : '1px solid transparent',
                        borderRadius: '0.3rem',
                        cursor: 'pointer',
                        fontWeight: activeFileTab === tab ? 600 : 400,
                        textTransform: 'capitalize'
                      }}
                    >
                      {tab === 'photos' && '📷'} {tab === 'documents' && '📄'} {tab === 'designs' && '🎨'} {tab}
                    </button>
                  ))}
                </div>

                {/* File Upload */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <FileUpload
                    projectId={selectedRealEstate}
                    folder={activeFileTab}
                    onUploadComplete={handleRealEstateFileUpload}
                  />
                </div>

                {/* File Gallery */}
                <FileGallery
                  projectId={selectedRealEstate}
                  files={realEstateFiles.filter(f => f.metadata?.folder === activeFileTab)}
                  onDelete={(fileId, storagePath) => handleDeleteRealEstateFile(storagePath, fileId)}
                  onRefresh={() => loadRealEstateFiles(selectedRealEstate)}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
