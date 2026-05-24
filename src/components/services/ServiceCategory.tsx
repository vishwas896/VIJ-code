import React from 'react';
import { motion } from 'framer-motion';
import { ServiceCard } from './ServiceCard';

interface ItemType {
  id: string;
  title: string;
  description: string;
  cta: string;
  link: string;
}

interface ServiceCategoryProps {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  items: ItemType[];
  isRelevant: boolean;
  activePersona: string;
}

export const ServiceCategory: React.FC<ServiceCategoryProps> = ({
  id,
  title,
  subtitle,
  icon,
  items,
  isRelevant,
  activePersona
}) => {
  return (
    <motion.div
      className={`service-category-section ${!isRelevant ? 'collapsed' : ''}`}
      initial={false}
      animate={{
        height: isRelevant ? 'auto' : 0,
        opacity: isRelevant ? 1 : 0,
        marginBottom: isRelevant ? '80px' : 0,
        pointerEvents: isRelevant ? 'all' : 'none'
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div className="category-header">
        <div className="category-title-row">
          <span className="category-icon">{icon}</span>
          <h2 className="category-title">{title}</h2>
        </div>
        <p className="category-subtitle">{subtitle}</p>
      </div>

      <div className={`services-bento-grid grid-${id}`}>
        {items.map((item) => {
          // Highlight items if persona is selected specifically
          const isItemHighlighted = activePersona !== 'all' && isRelevant;
          return (
            <ServiceCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              cta={item.cta}
              link={item.link}
              isHighlighted={isItemHighlighted}
            />
          );
        })}
      </div>
    </motion.div>
  );
};
