'use client';
import React, { useState } from 'react';
import { Grid, FileText, Video } from 'lucide-react';
import './PortfolioGrid.css';

const portfolioItems = [
  { id: 1, type: 'post', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80', likes: 124 },
  { id: 2, type: 'video', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80', views: 890 },
  { id: 3, type: 'project', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', likes: 342 },
  { id: 4, type: 'post', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80', likes: 56 },
  { id: 5, type: 'project', image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80', likes: 210 },
  { id: 6, type: 'video', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80', views: 1200 },
];

export const PortfolioGrid: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.type === activeTab);

  return (
    <div className="portfolio-grid-section glass-panel">
      <div className="portfolio-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
          <Grid size={16} /> All
        </button>
        <button className={activeTab === 'project' ? 'active' : ''} onClick={() => setActiveTab('project')}>
          <FileText size={16} /> Projects
        </button>
        <button className={activeTab === 'video' ? 'active' : ''} onClick={() => setActiveTab('video')}>
          <Video size={16} /> Media
        </button>
      </div>

      <div className="portfolio-bento-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="portfolio-card">
            <img src={item.image} alt={`Portfolio ${item.id}`} />
            <div className="portfolio-overlay">
              <span className="stats">
                {item.type === 'video' ? `👀 ${item.views}` : `❤️ ${item.likes}`}
              </span>
            </div>
            {item.type === 'video' && <div className="video-indicator"><Video size={18} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
