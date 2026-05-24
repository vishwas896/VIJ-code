import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../GlassCard';
import { 
  Map, Briefcase, Users, Globe, Wallet, Newspaper, User
} from 'lucide-react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  description: string;
}

interface Connection {
  from: string;
  to: string;
  label: string;
}

const NODES: Node[] = [
  { 
    id: 'career', 
    label: 'Your Career', 
    x: 300, 
    y: 300, 
    icon: <User size={24} />, 
    description: 'The core focal point of the VIJ ecosystem. Everything is designed to guide, accelerate, and reward your professional journey.' 
  },
  { 
    id: 'roadmaps', 
    label: 'Roadmaps', 
    x: 300, 
    y: 100, 
    icon: <Map size={20} />, 
    description: 'Step-by-step skill blueprints. Connects your career goals to tangible milestones.' 
  },
  { 
    id: 'jobs', 
    label: 'Jobs & Matching', 
    x: 480, 
    y: 200, 
    icon: <Briefcase size={20} />, 
    description: 'AI-matched job opportunities. Matches your verified roadmap skills directly with hiring employers.' 
  },
  { 
    id: 'community', 
    label: 'Community', 
    x: 480, 
    y: 400, 
    icon: <Users size={20} />, 
    description: 'Discussion bowls, stories, and challenges. Turns personal experiences into followable blueprints.' 
  },
  { 
    id: 'network', 
    label: 'Network Map', 
    x: 300, 
    y: 500, 
    icon: <Globe size={20} />, 
    description: 'A global visual network of professionals, recruiters, and mentors across all fields.' 
  },
  { 
    id: 'wallet', 
    label: 'Web3 Wallet', 
    x: 120, 
    y: 400, 
    icon: <Wallet size={20} />, 
    description: 'Manage premium features, mentor bookings, and tokens. Tracks value flow throughout your journey.' 
  },
  { 
    id: 'news', 
    label: 'Industry News', 
    x: 120, 
    y: 200, 
    icon: <Newspaper size={20} />, 
    description: 'Industry updates and market trends. Feeds real-world developments into your planning.' 
  }
];

const CONNECTIONS: Connection[] = [
  // Outer Connections
  { from: 'roadmaps', to: 'jobs', label: 'Skills feed matching' },
  { from: 'community', to: 'roadmaps', label: 'Stories generate templates' },
  { from: 'jobs', to: 'network', label: 'Referrals & connections' },
  { from: 'network', to: 'community', label: 'Mentor advice exchange' },
  { from: 'wallet', to: 'roadmaps', label: 'Unlocks premium paths' },
  { from: 'news', to: 'jobs', label: 'Market hiring trends' },
  // Core Connections
  { from: 'roadmaps', to: 'career', label: 'Guides growth' },
  { from: 'jobs', to: 'career', label: 'Secures employment' },
  { from: 'community', to: 'career', label: 'Provides support' },
  { from: 'network', to: 'career', label: 'Expands opportunities' },
  { from: 'wallet', to: 'career', label: 'Tracks tokens' },
  { from: 'news', to: 'career', label: 'Keeps informed' }
];

export const EcosystemDiagram: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getConnectedDetails = () => {
    if (!hoveredNode) return null;
    const node = NODES.find(n => n.id === hoveredNode);
    if (!node) return null;

    const connections = CONNECTIONS.filter(
      c => c.from === hoveredNode || c.to === hoveredNode
    );

    return {
      node,
      connections
    };
  };

  const activeDetails = getConnectedDetails();

  return (
    <section className="ecosystem-section">
      <div className="ecosystem-header text-center">
        <span className="services-badge">VIJ ECOSYSTEM</span>
        <h2>How It All Connects</h2>
        <p className="section-desc mx-auto">
          Every tool, community event, and roadmap module feeds back into your career. 
          Hover over the nodes below to see how data flows.
        </p>
      </div>

      <div className="ecosystem-container">
        {/* Desktop Interactive Canvas */}
        <div className="ecosystem-canvas-wrapper">
          <svg className="ecosystem-svg" viewBox="0 0 600 600">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A6E6E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Lines */}
            {CONNECTIONS.map((conn, idx) => {
              const nodeFrom = NODES.find(n => n.id === conn.from);
              const nodeTo = NODES.find(n => n.id === conn.to);
              if (!nodeFrom || !nodeTo) return null;

              const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
              const isDimmed = hoveredNode !== null && !isHighlighted;

              return (
                <g key={idx} className="connection-group">
                  <motion.line
                    x1={nodeFrom.x}
                    y1={nodeFrom.y}
                    x2={nodeTo.x}
                    y2={nodeTo.y}
                    stroke={isHighlighted ? 'url(#lineGrad)' : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    animate={{
                      strokeDasharray: isHighlighted ? '8 4' : 'none',
                      opacity: isDimmed ? 0.15 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {isHighlighted && (
                    <motion.circle
                      r={4}
                      fill="#FF6B6B"
                      filter="url(#glow)"
                      initial={{ offset: 0 }}
                      animate={{
                        cx: [nodeFrom.x, nodeTo.x],
                        cy: [nodeFrom.y, nodeTo.y],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Interactive Nodes */}
            {NODES.map((node) => {
              const isCenter = node.id === 'career';
              const isHighlighted = hoveredNode === node.id;
              const isDimmed = hoveredNode !== null && hoveredNode !== node.id;

              return (
                <g
                  key={node.id}
                  className={`node-group ${isCenter ? 'center-node' : ''}`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer Glow Halo */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isCenter ? 48 : 36}
                    fill={isCenter ? 'rgba(255, 107, 107, 0.08)' : 'rgba(10, 110, 110, 0.06)'}
                    stroke={isHighlighted ? (isCenter ? '#FF6B6B' : '#0A6E6E') : 'rgba(255,255,255,0.05)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    filter={isHighlighted ? 'url(#glow)' : 'none'}
                    animate={{
                      scale: isHighlighted ? 1.1 : 1,
                      opacity: isDimmed ? 0.3 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />

                  {/* Inner Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isCenter ? 36 : 28}
                    className="node-circle"
                  />

                  {/* Icon */}
                  <g transform={`translate(${node.x - (isCenter ? 12 : 10)}, ${node.y - (isCenter ? 12 : 10)})`} className="node-icon">
                    {node.icon}
                  </g>

                  {/* Text Label */}
                  <motion.text
                    x={node.x}
                    y={node.y + (isCenter ? 65 : 50)}
                    textAnchor="middle"
                    fill={isHighlighted ? '#ffffff' : 'rgba(255, 255, 255, 0.6)'}
                    fontSize={isCenter ? 14 : 11}
                    fontWeight={isCenter ? 800 : 600}
                    animate={{
                      opacity: isDimmed ? 0.3 : 1
                    }}
                  >
                    {node.label}
                  </motion.text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Info Glass Card overlay */}
          <div className="ecosystem-tooltip-container">
            <AnimatePresence mode="wait">
              {activeDetails ? (
                <motion.div
                  key={hoveredNode}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard className="ecosystem-info-card" glowingEdge="azure" tilt={false}>
                    <h4>{activeDetails.node.label}</h4>
                    <p>{activeDetails.node.description}</p>
                    {activeDetails.connections.length > 0 && (
                      <div className="tooltip-connections">
                        <h5>Data Flows:</h5>
                        <ul>
                          {activeDetails.connections.map((c, i) => (
                            <li key={i}>
                              <strong>{NODES.find(n => n.id === c.from)?.label}</strong>
                              <span> → </span>
                              <span>{c.label}</span>
                              <span> → </span>
                              <strong>{NODES.find(n => n.id === c.to)?.label}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ecosystem-idle-card"
                >
                  <GlassCard className="ecosystem-info-card idle" tilt={false}>
                    <h4>Interactive Network</h4>
                    <p>Hover over any node in the circular map to explore its feature parameters and understand how user roadmaps link directly to employment matching, community story exchanges, and more.</p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Static / Simple List Representation */}
        <div className="ecosystem-mobile-fallback">
          <GlassCard className="mobile-diagram-card" tilt={false}>
            <div className="mobile-center-node">
              <User size={24} style={{ color: '#FF6B6B' }} />
              <h4>Your Career Focus</h4>
            </div>
            <div className="mobile-nodes-list">
              {NODES.filter(n => n.id !== 'career').map((n) => (
                <div key={n.id} className="mobile-node-item">
                  <div className="mobile-node-item-header">
                    <span className="mobile-node-icon">{n.icon}</span>
                    <h5>{n.label}</h5>
                  </div>
                  <p>{n.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
