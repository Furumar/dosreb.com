'use client';

import { useState, useRef, DragEvent } from 'react';

interface FileUploadProps {
  projectId: string;
  onUploadComplete: (file: any) => void;
  folder?: 'documents' | 'designs' | 'photos';
}

export default function FileUpload({ projectId, onUploadComplete, folder = 'documents' }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);

    for (const file of files) {
      try {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);
        formData.append('folder', folder);

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
        onUploadComplete(result);

        // Clear progress after a delay
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 2000);
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
  };

  return (
    <div className="file-upload">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        />

        <div className="drop-zone-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="drop-zone-title">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="drop-zone-subtitle">or click to browse</p>
          <p className="drop-zone-hint">
            Supports: Images, PDFs, Documents (Max 50MB each)
          </p>
        </div>
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="progress-item">
              <span className="progress-filename">{filename}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-percent">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .file-upload {
          width: 100%;
        }

        .drop-zone {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #fafafa;
        }

        .drop-zone:hover {
          border-color: #0070f3;
          background: #f0f8ff;
        }

        .drop-zone.dragging {
          border-color: #0070f3;
          background: #e6f3ff;
          border-style: solid;
        }

        .drop-zone-content svg {
          color: #666;
          margin: 0 auto 1rem;
        }

        .drop-zone-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: #333;
          margin: 0 0 0.5rem;
        }

        .drop-zone-subtitle {
          color: #666;
          margin: 0 0 1rem;
        }

        .drop-zone-hint {
          font-size: 0.875rem;
          color: #999;
          margin: 0;
        }

        .upload-progress {
          margin-top: 1.5rem;
        }

        .progress-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .progress-filename {
          font-size: 0.875rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .progress-bar {
          grid-column: 1 / -1;
          height: 4px;
          background: #e5e5e5;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #0070f3;
          transition: width 0.3s;
        }

        .progress-percent {
          font-size: 0.75rem;
          color: #666;
          min-width: 40px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
