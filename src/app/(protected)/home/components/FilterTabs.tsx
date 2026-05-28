'use client';

import React, { useRef, useEffect, useState } from 'react';

interface FilterTabsProps {
  activeTab: 'industry' | 'trending' | 'connections';
  onChangeTab: (tab: 'industry' | 'trending' | 'connections') => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onChangeTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

  const tabs: { id: 'industry' | 'trending' | 'connections'; label: string }[] = [
    { id: 'industry', label: 'My Industry' },
    { id: 'trending', label: 'Trending' },
    { id: 'connections', label: 'Connections' },
  ];

  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.querySelector('.filter-tab.active') as HTMLElement;
      if (activeElement) {
        setIndicatorStyle({
          left: `${activeElement.offsetLeft}px`,
          width: `${activeElement.offsetWidth}px`,
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="feed-filter-container" ref={containerRef}>
      <span className="filter-tab-active-indicator" style={indicatorStyle} />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChangeTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
