'use client';
import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Plus, Trash2, Save, X, Clock, ChevronRight } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './RoadmapBuilder.css';

interface RoadmapNode {
  id: string;
  title: string;
  duration: string;
  color: string;
}

const availableModules: RoadmapNode[] = [
  { id: 'react-basics', title: 'React Fundamentals', duration: '4 hrs', color: '#61dafb' },
  { id: 'advanced-hooks', title: 'Advanced Hooks', duration: '3 hrs', color: '#f59e0b' },
  { id: 'graphql', title: 'GraphQL Mastery', duration: '5 hrs', color: '#e535ab' },
  { id: 'system-arch', title: 'System Architecture', duration: '6 hrs', color: '#10b981' },
  { id: 'cicd', title: 'CI/CD Pipelines', duration: '3 hrs', color: '#6366f1' },
  { id: 'testing', title: 'Testing Strategies', duration: '4 hrs', color: '#ef4444' },
  { id: 'perf', title: 'Performance Tuning', duration: '3 hrs', color: '#8b5cf6' },
  { id: 'a11y', title: 'Accessibility (A11y)', duration: '2 hrs', color: '#14b8a6' },
];

const moduleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.05, type: 'spring' as const, stiffness: 300, damping: 24 }
  })
};

export const RoadmapBuilder: React.FC = () => {
  const [canvasNodes, setCanvasNodes] = useState<RoadmapNode[]>([
    { id: 'intro', title: 'Introduction to Frontend', duration: '2 hrs', color: '#0ea5e9' }
  ]);
  const [saved, setSaved] = useState(false);

  const addToCanvas = (mod: RoadmapNode) => {
    if (!canvasNodes.find(n => n.id === mod.id)) {
      setCanvasNodes(prev => [...prev, mod]);
    }
  };

  const removeFromCanvas = (id: string) => {
    setCanvasNodes(prev => prev.filter(n => n.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalHours = canvasNodes.reduce((acc, n) => acc + parseInt(n.duration), 0);

  return (
    <PageTransition>
      <div className="roadmap-builder-root">
        {/* Header */}
        <motion.div 
          className="roadmap-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div>
            <h1 className="roadmap-title">Roadmap Builder</h1>
            <p className="roadmap-subtitle">
              Drag modules from the palette to build your custom learning path
            </p>
          </div>
          <div className="roadmap-header-actions">
            <motion.div className="roadmap-total-hours">
              <Clock size={14} /> {totalHours}h total
            </motion.div>
            <GlassButton variant="secondary" icon={<X size={16} />}>Cancel</GlassButton>
            <GlassButton 
              variant="primary" 
              icon={<Save size={16} />} 
              onClick={handleSave}
            >
              {saved ? '✓ Saved!' : 'Save Roadmap'}
            </GlassButton>
          </div>
        </motion.div>

        <div className="roadmap-layout">
          {/* Sidebar - Module Palette */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <GlassCard className="roadmap-sidebar-card">
              <h3 className="roadmap-sidebar-title">
                Available Modules
              </h3>
              
              <div className="roadmap-modules-list">
                {availableModules.map((mod, i) => {
                  const isAdded = canvasNodes.some(n => n.id === mod.id);
                  return (
                    <motion.div 
                      key={mod.id}
                      custom={i}
                      variants={moduleVariants}
                      initial="hidden"
                      animate="visible"
                      onClick={() => !isAdded && addToCanvas(mod)}
                      className={`roadmap-module-item ${isAdded ? 'added' : 'available'}`}
                    >
                      <div 
                        className="roadmap-module-color-strip"
                        style={{ background: mod.color }} 
                      />
                      <div className="roadmap-module-info">
                        <div className="roadmap-module-title">{mod.title}</div>
                        <div className="roadmap-module-duration">
                          <Clock size={10} /> {mod.duration}
                        </div>
                      </div>
                      {isAdded ? (
                        <span className="roadmap-module-status">Added</span>
                      ) : (
                        <Plus size={16} className="roadmap-module-add-icon" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            className="roadmap-canvas-wrapper"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <GlassCard className="roadmap-canvas-card">
              {/* Dot grid background */}
              <div className="roadmap-canvas-bg" />
              
              <div className="roadmap-canvas-content">
                <Reorder.Group 
                  axis="y" 
                  values={canvasNodes} 
                  onReorder={setCanvasNodes}
                  className="roadmap-reorder-group"
                >
                  {canvasNodes.map((node, i) => (
                    <Reorder.Item key={node.id} value={node} className="roadmap-reorder-item">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        className="roadmap-node-container"
                      >
                        <div 
                          className="roadmap-node-card"
                          style={{ 
                            border: `2px solid ${node.color}`,
                            boxShadow: `0 4px 20px ${node.color}33`,
                          }}
                        >
                          <GripVertical size={16} className="roadmap-grip-icon" />
                          <div 
                            className="roadmap-node-color-indicator"
                            style={{ background: node.color }} 
                          />
                          <div className="roadmap-node-info">
                            <div className="roadmap-node-title">{node.title}</div>
                            <div className="roadmap-node-duration">{node.duration}</div>
                          </div>
                          {i > 0 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCanvas(node.id)}
                              className="roadmap-delete-btn"
                            >
                              <Trash2 size={14} className="roadmap-delete-icon" />
                            </motion.button>
                          )}
                        </div>
                        
                        {i < canvasNodes.length - 1 && (
                          <div className="roadmap-connector">
                            <div className="roadmap-connector-top" />
                            <ChevronRight size={14} className="roadmap-connector-icon" />
                            <div className="roadmap-connector-bottom" />
                          </div>
                        )}
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>

                {/* Drop Zone */}
                <motion.div 
                  className="roadmap-drop-zone"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="roadmap-drop-zone-inner">
                    <Plus size={16} /> Click a module to add it here
                  </div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

