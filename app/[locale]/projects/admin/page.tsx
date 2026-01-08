'use client';

import { useState } from 'react';
import Image from 'next/image';

type ReferenceProject = 'stockmann' | 'dbschenker' | 'jatkasaari';

export default function ProjectAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedProject, setSelectedProject] = useState<ReferenceProject>('stockmann');
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    if (password === 'dosreb2026admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700', fontWeight: 600 }}>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  background: 'rgba(255, 215, 0, 0.08)',
                  color: '#ffd700',
                  fontSize: '1rem'
                }}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {authError && (
              <p style={{ color: '#f00', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {authError}
              </p>
            )}
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
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Login
            </button>
          </form>
        </section>
      </div>
    );
  }

  const projectNames = {
    stockmann: 'Stockmann',
    dbschenker: 'DB Schenker',
    jatkasaari: 'Jätkäsaaren maanalaiset tilat'
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
          const data = await response.json();
          uploaded.push(file.name);
          console.log('Upload success:', data);
        } else {
          const errorData = await response.json();
          console.error('Upload failed:', errorData);
          errors.push(`${file.name}: ${errorData.details || errorData.error}`);
        }
      }

      setUploadedFiles([...uploadedFiles, ...uploaded]);
      
      if (uploaded.length > 0) {
        setMessage(`✓ Successfully uploaded ${uploaded.length} image(s) to ${projectNames[selectedProject]}`);
      }
      
      if (errors.length > 0) {
        setMessage(prev => prev + '\n\n✗ Errors:\n' + errors.join('\n'));
      }
      
      // Clear file input
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`✗ Error uploading files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>Reference Projects Admin</h1>
        <p className="page-lead">
          Upload images for Stockmann, DB Schenker, and Jätkäsaari reference projects
        </p>
      </section>

      <section className="page-section">
        <h2 className="section-title">Upload Project Images</h2>
        
        {/* Project Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700', fontWeight: 600 }}>
            Select Project:
          </label>
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
              width: '100%',
              maxWidth: '400px',
              cursor: 'pointer'
            }}
          >
            <option value="stockmann">Stockmann</option>
            <option value="dbschenker">DB Schenker</option>
            <option value="jatkasaari">Jätkäsaaren maanalaiset tilat</option>
          </select>
        </div>

        {/* File Upload */}
        <div style={{ marginBottom: '2rem' }}>
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
              transition: 'all 0.3s ease'
            }}
          >
            {uploading ? 'Uploading...' : '📁 Choose Images to Upload'}
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
          <p style={{ marginTop: '0.5rem', color: 'rgba(255, 251, 230, 0.7)', fontSize: '0.9rem' }}>
            Select multiple images (JPG, PNG, WebP, etc.)
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            background: message.includes('✓') 
              ? 'rgba(0, 255, 0, 0.1)' 
              : 'rgba(255, 0, 0, 0.1)',
            border: `1px solid ${message.includes('✓') ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}`,
            color: message.includes('✓') ? '#0f0' : '#f00',
            whiteSpace: 'pre-wrap'
          }}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.05)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ color: '#ffd700', marginBottom: '1rem', fontSize: '1.2rem' }}>
            📋 Instructions:
          </h3>
          <ol style={{ color: 'rgba(255, 251, 230, 0.9)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
            <li>Select which reference project you want to upload images for</li>
            <li>Click "Choose Images to Upload" and select one or multiple images</li>
            <li>Wait for the upload to complete</li>
            <li>Images will automatically appear on the project page</li>
            <li>Repeat for other projects as needed</li>
          </ol>
          <p style={{ marginTop: '1rem', color: 'rgba(255, 251, 230, 0.7)', fontSize: '0.95rem' }}>
            💡 <strong>Note:</strong> Make sure you've created the "projects" bucket in Supabase Storage first.
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '1rem' }}>Recently Uploaded:</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {uploadedFiles.map((file, index) => (
                <li 
                  key={index}
                  style={{
                    padding: '0.5rem',
                    color: 'rgba(255, 251, 230, 0.8)',
                    borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
                  }}
                >
                  ✓ {file}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
