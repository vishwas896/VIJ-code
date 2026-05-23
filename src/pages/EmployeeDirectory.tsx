import React from 'react';
import { useParams } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import './EmployeeDirectory.css';

export const EmployeeDirectory: React.FC = () => {
  const { companyId } = useParams();

  const employees = [
    { name: 'Alice Smith', status: 'Active', role: 'Senior Dev', hike: '+15%' },
    { name: 'Bob Johnson', status: 'Notice Period', role: 'UI Lead', hike: 'N/A' },
    { name: 'Charlie Davis', status: 'Promoted', role: 'Architect', hike: '+25%' },
  ];

  return (
    <PageTransition>
      <div className="employee-page">
        <header className="page-header">
          <h1 className="text-gradient">Employee Directory</h1>
          <p>Personnel tracking for {companyId || 'Enterprise'}</p>
        </header>

        <div className="employee-list">
          {employees.map((emp, i) => (
            <GlassCard key={i} className="employee-card">
              <div className="emp-info">
                <h4>{emp.name}</h4>
                <p>{emp.role}</p>
              </div>
              <div className={`emp-status status-${emp.status.toLowerCase().replace(' ', '-')}`}>
                {emp.status}
              </div>
              <div className="emp-hike">{emp.hike}</div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};
