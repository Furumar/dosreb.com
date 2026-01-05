'use client';

import { useState, useEffect } from 'react';

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

interface FileGalleryProps {
  projectId: string;
  files: FileRecord[];
  onDelete: (fileId: string, storagePath: string) => void;
  onRefresh: () => void;
}

export default function FileGallery({ projectId, files, onDelete, onRefresh }: FileGalleryProps) {
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'documents' | 'designs' | 'photos'>('all');

  useEffect(() => {
    if (selectedFile) {
      loadFileUrl(selectedFile.storage_path);
    }
  }, [selectedFile]);

  const loadFileUrl = async (storagePath: string) => {
    try {
      const response = await fetch(`/api/files?filePath=${encodeURIComponent(storagePath)}`);
      const data = await response.json();
      setFileUrl(data.url);
    } catch (error) {
      console.error('Error loading file URL:', error);
    }
  };

  const filteredFiles = filter === 'all'
    ? files
    : files.filter((file) => file.metadata.folder === filter);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
    return '📁';
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');
  const isPdf = (mimeType: string) => mimeType === 'application/pdf';

  return (
    <div className="file-gallery">
      <div className="gallery-header">
        <h3>Files ({files.length})</h3>
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'documents' ? 'active' : ''}
            onClick={() => setFilter('documents')}
          >
            Documents
          </button>
          <button
            className={filter === 'designs' ? 'active' : ''}
            onClick={() => setFilter('designs')}
          >
            Designs
          </button>
          <button
            className={filter === 'photos' ? 'active' : ''}
            onClick={() => setFilter('photos')}
          >
            Photos
          </button>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="empty-state">
          <p>No files found. Upload files to get started!</p>
        </div>
      ) : (
        <div className="files-grid">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="file-card"
              onClick={() => setSelectedFile(file)}
            >
              <div className="file-icon">
                {getFileIcon(file.mime_type)}
              </div>
              <div className="file-info">
                <div className="file-name" title={file.filename}>
                  {file.filename}
                </div>
                <div className="file-meta">
                  {formatFileSize(file.size)} • {file.metadata.folder || 'documents'}
                </div>
              </div>
              <button
                className="file-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this file?')) {
                    onDelete(file.id, file.storage_path);
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFile && (
        <div className="file-viewer-modal" onClick={() => setSelectedFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedFile.filename}</h3>
              <button onClick={() => setSelectedFile(null)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              {fileUrl && isImage(selectedFile.mime_type) && (
                <img src={fileUrl} alt={selectedFile.filename} />
              )}
              {fileUrl && isPdf(selectedFile.mime_type) && (
                <iframe src={fileUrl} title={selectedFile.filename} />
              )}
              {fileUrl && !isImage(selectedFile.mime_type) && !isPdf(selectedFile.mime_type) && (
                <div className="download-prompt">
                  <p>Preview not available for this file type.</p>
                  <a href={fileUrl} download={selectedFile.filename} className="btn-download">
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .file-gallery {
          width: 100%;
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .gallery-header h3 {
          margin: 0;
          font-size: 1.25rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .filter-tabs button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tabs button:hover {
          background: #f5f5f5;
        }

        .filter-tabs button.active {
          background: #0070f3;
          color: white;
          border-color: #0070f3;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #666;
          background: #fafafa;
          border-radius: 8px;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .file-card {
          position: relative;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .file-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #0070f3;
        }

        .file-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .file-info {
          text-align: center;
        }

        .file-name {
          font-weight: 500;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 0.25rem;
        }

        .file-meta {
          font-size: 0.75rem;
          color: #999;
        }

        .file-delete {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 24px;
          height: 24px;
          border: none;
          background: rgba(255, 68, 68, 0.9);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .file-card:hover .file-delete {
          opacity: 1;
        }

        .file-delete:hover {
          background: #cc0000;
        }

        .file-viewer-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 1200px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e5e5;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.125rem;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: #f5f5f5;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.5rem;
          line-height: 1;
        }

        .close-btn:hover {
          background: #e5e5e5;
        }

        .modal-body {
          flex: 1;
          overflow: auto;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .modal-body iframe {
          width: 100%;
          height: 70vh;
          border: none;
        }

        .download-prompt {
          text-align: center;
        }

        .download-prompt p {
          color: #666;
          margin-bottom: 1rem;
        }

        .btn-download {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .btn-download:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
}
