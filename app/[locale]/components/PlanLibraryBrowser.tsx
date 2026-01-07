'use client';

import { useState, useEffect } from 'react';

interface Plan {
  id: string;
  title: string;
  description?: string;
  filename: string;
  category_id?: string;
  tags?: string[];
  usage_count: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface PlanLibraryBrowserProps {
  projectId?: string;
  onSelectPlan?: (plan: Plan) => void;
  mode?: 'browse' | 'select';
}

export default function PlanLibraryBrowser({ 
  projectId, 
  onSelectPlan,
  mode = 'browse'
}: PlanLibraryBrowserProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadPlans();
  }, [selectedCategory, searchTerm]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/plan-library?action=categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('categoryId', selectedCategory);
      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/plan-library?${params}`);
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkToProject = async (planId: string) => {
    if (!projectId) return;

    try {
      await fetch('/api/plan-library?action=link-to-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, planId })
      });

      alert('Plan linked to project successfully!');
    } catch (error) {
      console.error('Error linking plan:', error);
      alert('Failed to link plan');
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    if (mode === 'select' && onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  if (loading) {
    return <div className="plan-library-browser">Loading Plan Library...</div>;
  }

  return (
    <div className="plan-library-browser">
      <div className="browser-header">
        <h2>📚 Plan Library</h2>
        <p>Browse and reuse existing plans across your projects</p>
      </div>

      <div className="browser-controls">
        <input
          type="text"
          placeholder="🔍 Search plans..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="plans-grid">
        {plans.length === 0 ? (
          <div className="empty-state">
            <p>No plans found. Upload your first plan to get started!</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <div className="plan-icon">📄</div>
              <div className="plan-info">
                <h3>{plan.title}</h3>
                {plan.description && <p>{plan.description}</p>}
                <div className="plan-meta">
                  <span className="filename">{plan.filename}</span>
                  <span className="usage">🔄 Used {plan.usage_count} times</span>
                </div>
                {plan.tags && plan.tags.length > 0 && (
                  <div className="tags">
                    {plan.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="plan-actions">
                {mode === 'select' ? (
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="btn-select"
                  >
                    Select
                  </button>
                ) : projectId ? (
                  <button
                    onClick={() => handleLinkToProject(plan.id)}
                    className="btn-link"
                  >
                    + Add to Project
                  </button>
                ) : (
                  <button className="btn-view">View</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .plan-library-browser {
          padding: 2rem;
        }

        .browser-header {
          margin-bottom: 2rem;
        }

        .browser-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .browser-header p {
          color: #666;
        }

        .browser-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-input,
        .category-select {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .search-input {
          flex: 1;
        }

        .category-select {
          min-width: 200px;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .plan-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s;
        }

        .plan-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .plan-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .plan-info {
          flex: 1;
        }

        .plan-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .plan-info p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .plan-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #888;
          margin: 0.75rem 0;
        }

        .filename {
          font-family: monospace;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .plan-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .btn-select,
        .btn-link,
        .btn-view {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-select,
        .btn-link {
          background: #0070f3;
          color: white;
        }

        .btn-select:hover,
        .btn-link:hover {
          background: #0051cc;
        }

        .btn-view {
          background: #f0f0f0;
          color: #333;
        }

        .btn-view:hover {
          background: #e0e0e0;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
