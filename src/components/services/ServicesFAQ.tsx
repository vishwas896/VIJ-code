import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import servicesData from '../../data/servicesData.json';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlassCard 
      className={`faq-item-card ${isOpen ? 'active' : ''}`}
      tilt={false}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="faq-question-row">
        <h4 className="faq-question">{question}</h4>
        <span className="faq-arrow-icon">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="faq-answer">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export const ServicesFAQ: React.FC = () => {
  const faqs = servicesData.faq;

  return (
    <section className="faq-section">
      <div className="faq-header text-center">
        <span className="services-badge">FAQ</span>
        <h2>Frequently Asked Questions</h2>
        <p className="section-desc mx-auto">
          Got questions about our services, plans, or community tools? We have got you covered.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </section>
  );
};
