'use client';

import { useState } from 'react';
import PlanLibraryBrowser from '../components/PlanLibraryBrowser';

export default function PlanLibraryPage() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showSetupAlert, setShowSetupAlert] = useState(true);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    visibility: 'private' as 'private' | 'public' | 'organization'
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Note: This is a simplified version. In production, you'd handle file upload to Supabase Storage first
    alert('Plan Library upload feature coming soon! For now, upload files to projects and mark them as templates.');
    setShowUploadForm(false);
  };

  return (
    <div className="dosreb-page">
      <section className="page-hero">
        <h1>📚 Plan Library</h1>
        <p className="page-lead">
          Browse, share, and reuse floor plans, sections, facades, and design assets across all your projects
        </p>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="btn-primary"
          style={{ marginTop: '1rem' }}
        >
          {showUploadForm ? 'Cancel' : '+ Upload New Plan'}
        </button>
      </section>

      {showSetupAlert && (
        <section className="page-section">
          <div className="alert-info">
            <div className="alert-header">
              <h3>ℹ️ New Feature!</h3>
              <button onClick={() => setShowSetupAlert(false)} className="close-btn">×</button>
            </div>
            <p>
              The Plan Library lets you upload and reuse floor plans, sections, and facades across all your projects.
              This dramatically speeds up project creation!
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <strong>Note:</strong> If you see an error below, you need to run the database migrations first.
              See <code>db/SETUP_INSTRUCTIONS.md</code> for details.
            </p>
          </div>
        </section>
      )}

      {showUploadForm && (
        <section className="page-section">
          <form onSubmit={handleUpload} className="upload-form">
            <h2>Upload Plan to Library</h2>
            
            <div className="form-group">
              <label htmlFor="title">Plan Title *</label>
              <input
                type="text"
                id="title"
                value={uploadData.title}
                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                required
                placeholder="e.g., Office Building Floor Plan - Level 2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                rows={3}
                placeholder="Describe this plan..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={uploadData.category}
                onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
              >
                <option value="">Select category...</option>
                <option value="floor_plans">📐 Floor Plans</option>
                <option value="sections">📏 Sections</option>
                <option value="facades">🏛️ Facades</option>
                <option value="details">🔍 Details</option>
                <option value="site_plans">🗺️ Site Plans</option>
                <option value="3d_models">🏗️ 3D Models</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                value={uploadData.tags}
                onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                placeholder="e.g., office, modern, 500sqm, commercial"
              />
            </div>

            <div className="form-group">
              <label htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                value={uploadData.visibility}
                onChange={(e) => setUploadData({ ...uploadData, visibility: e.target.value as any })}
              >
                <option value="private">Private (only you)</option>
                <option value="organization">Organization (your team)</option>
                <option value="public">Public (everyone)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="file">File *</label>
              <input
                type="file"
                id="file"
                accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
              />
              <small>Accepted formats: PDF, DWG, DXF, PNG, JPG</small>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Upload to Library
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="page-section">
        <PlanLibraryBrowser mode="browse" />
      </section>

      <section className="page-section">
        <h2 className="section-title">💡 How to Use Plan Library</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">📤</div>
            <h3>Upload & Share</h3>
            <p>Upload your floor plans, sections, and facades to create a reusable library</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔍</div>
            <h3>Search & Filter</h3>
            <p>Find plans by category, tags, or keywords. See which plans are most popular</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔗</div>
            <h3>Link to Projects</h3>
            <p>Quickly add existing plans to new projects instead of uploading duplicates</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h3>Track Usage</h3>
            <p>See how many times each plan has been used across projects</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⭐</div>
            <h3>Favorites</h3>
            <p>Bookmark your most-used plans for quick access</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔄</div>
            <h3>Version Control</h3>
            <p>Track updates and changes to plans over time</p>
          </div>
        </div>
      </section>

      <style jsx>{`
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

        .btn-secondary {
          padding: 0.75rem 1.5rem;
          background: #f0f0f0;
          color: #333;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
        }

        .upload-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        small {
          display: block;
          margin-top: 0.25rem;
          color: #666;
          font-size: 0.85rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature {
          text-align: center;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .feature p {
          color: #666;
        }

        .alert-info {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 1.5rem;
          border-radius: 4px;
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .alert-header h3 {
          margin: 0;
          color: #1976d2;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #1976d2;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          line-height: 1;
        }

        .close-btn:hover {
          background: rgba(33, 150, 243, 0.1);
          border-radius: 4px;
        }

        .alert-info code {
          background: rgba(25, 118, 210, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}
