'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Laptop, BarChart2, Globe, Heart, Shield, Award, BookOpen, Database, ArrowRight
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import landingData from '../../data/landing.json';
import './landing.css';

export const IndustryGrid: React.FC = () => {
  const router = useRouter();
  const { formatCurrency } = useCurrency();

  const formatSalary = (valStr: string) => {
    const digits = valStr.replace(/[^0-9]/g, '');
    const num = parseInt(digits, 10);
    if (isNaN(num)) return valStr;
    return formatCurrency(num, true);
  };

  const icons = [
    <Laptop size={24} color="#0A6E6E" />,
    <BarChart2 size={24} color="#0A6E6E" />,
    <Globe size={24} color="#0A6E6E" />,
    <Heart size={24} color="#0A6E6E" />,
    <Shield size={24} color="#0A6E6E" />,
    <Award size={24} color="#0A6E6E" />,
    <BookOpen size={24} color="#0A6E6E" />,
    <Database size={24} color="#0A6E6E" />
  ];

  return (
    <section className="ld-section">
      <div className="ld-section-header">
        <h2>Industry Coverage</h2>
        <p>Explore specialized roadmap networks matching your domain.</p>
      </div>

      <div className="ld-bento-grid">
        {landingData.industries.map((ind, idx) => (
          <motion.div
            key={ind.code}
            className="ld-bento-cell"
            onClick={() => router.push(`/roadmaps?industry=${ind.code}`)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <div className="cell-icon-wrap">{icons[idx]}</div>
            <span className="cell-title">{ind.label}</span>
            
            <div className="cell-hover-details">
              <span className="avg-sal-lbl">Avg. Salary: {formatSalary(ind.avgSalary)}</span>
              <span className="snippet-txt">e.g. {ind.snippet}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '10px', color: 'var(--color-coral-cta)', fontWeight: 800 }}>
                <span>Explore Paths</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

