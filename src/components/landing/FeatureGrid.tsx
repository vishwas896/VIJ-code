import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sliders, Compass, ShieldAlert, Award, MessageSquare, FileJson, 
  ArrowRight, Check
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { useCurrency } from '../../context/CurrencyContext';
import './landing.css';

export const FeatureGrid: React.FC = () => {
  const { formatCurrency } = useCurrency();

  // --- TILE 1 STATES (Simulator) ---
  const [targetRole, setTargetRole] = useState<'mid' | 'sr' | 'lead'>('sr');
  const [remoteAllocation, setRemoteAllocation] = useState<number>(60);

  // Math simulation for Tile 1
  const getSimulatedSalary = () => {
    let base = 80000;
    if (targetRole === 'mid') base = 95000;
    if (targetRole === 'sr') base = 135000;
    if (targetRole === 'lead') base = 170000;

    const multiplier = 1 + (remoteAllocation / 200);
    return Math.round(base * multiplier);
  };

  // --- TILE 2 STATES (Graph pivots) ---
  const [activePivot, setActivePivot] = useState<string | null>(null);

  // --- TILE 5 STATES (Mentor Carousel) ---
  const mentors = [
    { name: 'Sanjay Dutt', role: 'Staff DevOps, Uber', cost: 'Free', avatar: 'SD' },
    { name: 'Elena R.', role: 'VP Product, Stripe', cost: 'Free', avatar: 'ER' },
    { name: 'Sarah Wu', role: 'Principal Architect, AWS', cost: 'Free', avatar: 'SW' }
  ];
  const [mentorIndex, setMentorIndex] = useState(0);

  // --- TILE 6 STATES (Content-to-Roadmap Engine) ---
  const [inputUrl, setInputUrl] = useState('');
  const [engineStatus, setEngineStatus] = useState<'idle' | 'analyzing' | 'success'>('idle');

  const handleSimulateEngine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    setEngineStatus('analyzing');
    setTimeout(() => {
      setEngineStatus('success');
    }, 1800);
  };

  return (
    <section className="ld-section">
      <div className="ld-section-header">
        <h2>Core Services Bento Grid</h2>
        <p>Explore the futuristic tools powering your career progression.</p>
      </div>

      <div className="ld-bento-grid-full">
        {/* =========================================================================
            TILE 1: SCENARIO SIMULATOR
           ========================================================================= */}
        <GlassCard className="bento-tile tile-large-col" glowingEdge="azure">
          <div className="bento-header">
            <Sliders size={20} className="bento-icon" />
            <h3>Career Scenario Simulator</h3>
          </div>
          <p className="bento-desc">
            Adjust role titles and remote work preferences to recalculate salary curves in real time.
          </p>

          <div className="bento-widget-simulator">
            <div className="sim-control-pane">
              <div className="sim-control-group">
                <label>Target Role Tier</label>
                <div className="btn-group-sm">
                  {(['mid', 'sr', 'lead'] as const).map(role => (
                    <button
                      key={role}
                      className={`btn-toggle-sm ${targetRole === role ? 'active' : ''}`}
                      onClick={() => setTargetRole(role)}
                    >
                      {role === 'mid' ? 'Mid-Level' : role === 'sr' ? 'Senior' : 'Lead / Staff'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sim-control-group">
                <label>Remote Work Allocation ({remoteAllocation}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={remoteAllocation}
                  onChange={e => setRemoteAllocation(parseInt(e.target.value))}
                  className="widget-slider"
                />
              </div>
            </div>

            <div className="sim-result-pane">
              <span className="sim-result-lbl">Projected Comp</span>
              <h4 className="sim-result-val">{formatCurrency(getSimulatedSalary(), true)}</h4>
              
              {/* Dynamic Sparkline SVG based on current parameters */}
              <svg viewBox="0 0 160 40" className="sim-sparkline">
                <path
                  d={`M 0,35 Q 40,${35 - remoteAllocation/4} 80,${30 - remoteAllocation/3} T 160,${targetRole === 'mid' ? 25 : targetRole === 'sr' ? 12 : 5}`}
                  fill="none"
                  stroke="var(--color-coral-cta)"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </GlassCard>

        {/* =========================================================================
            TILE 2: SKILL & ROLE GRAPH
           ========================================================================= */}
        <GlassCard className="bento-tile tile-large-col">
          <div className="bento-header">
            <Compass size={20} className="bento-icon" style={{ color: '#0A6E6E' }} />
            <h3>Skill & Role Graph</h3>
          </div>
          <p className="bento-desc">
            No more rigid pathways. Click nodes to trace unconventional pivots and skill bridges.
          </p>

          <div className="bento-widget-graph">
            <svg viewBox="0 0 160 110" className="mini-radial-svg">
              <line x1="80" y1="55" x2="30" y2="25" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="80" y1="55" x2="130" y2="25" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="80" y1="55" x2="80" y2="95" stroke="#cbd5e1" strokeWidth="1" />

              {/* Central node */}
              <circle cx="80" cy="55" r="8" fill="var(--color-teal-primary)" />
              
              {/* Outer branch nodes */}
              <circle cx="30" cy="25" r="7" fill={activePivot === 'dev' ? '#FF6B6B' : '#0A6E6E'} onClick={() => setActivePivot('dev')} style={{ cursor: 'pointer' }} />
              <circle cx="130" cy="25" r="7" fill={activePivot === 'pm' ? '#FF6B6B' : '#0A6E6E'} onClick={() => setActivePivot('pm')} style={{ cursor: 'pointer' }} />
              <circle cx="80" cy="95" r="7" fill={activePivot === 'design' ? '#FF6B6B' : '#0A6E6E'} onClick={() => setActivePivot('design')} style={{ cursor: 'pointer' }} />
            </svg>

            <div className="graph-tooltip-mini">
              {activePivot === 'dev' && <span>💻 Dev Track: +40% average salary hike</span>}
              {activePivot === 'pm' && <span>📈 Product: 12 months transition track</span>}
              {activePivot === 'design' && <span>🎨 Design: High competency match</span>}
              {!activePivot && <span>Tap nodes to examine transition parameters</span>}
            </div>
          </div>
        </GlassCard>

        {/* =========================================================================
            TILE 3: ANTI-GHOSTING TRACKER
           ========================================================================= */}
        <GlassCard className="bento-tile">
          <div className="bento-header">
            <ShieldAlert size={20} className="bento-icon" style={{ color: '#FF6B6B' }} />
            <h3>Anti-Ghosting Tracker</h3>
          </div>
          <p className="bento-desc">
            Direct tracking pipelines ensure you always get recruiter responses.
          </p>

          <div className="bento-widget-tracker">
            <div className="tracker-pipeline">
              <div className="pipeline-node completed">
                <span className="dot" />
                <span className="lbl">Applied</span>
              </div>
              <div className="pipeline-connector active" />
              <div className="pipeline-node completed">
                <span className="dot" />
                <span className="lbl">Viewed</span>
              </div>
              <div className="pipeline-connector running" />
              <div className="pipeline-node active">
                <span className="dot pulse-blue" />
                <span className="lbl">Interview</span>
              </div>
            </div>
            <div className="tracker-badge-coral">
              ⚡ 85% Less Ghosting
            </div>
          </div>
        </GlassCard>

        {/* =========================================================================
            TILE 4: GAMIFIED SKILL CLOUD
           ========================================================================= */}
        <GlassCard className="bento-tile">
          <div className="bento-header">
            <Award size={20} className="bento-icon" />
            <h3>Skill Cloud Challenges</h3>
          </div>
          <p className="bento-desc">
            Verify competency through 1v1 challenges and earn custom experience badges.
          </p>

          <div className="bento-widget-skills">
            <div className="skill-bubble b1">React +120XP</div>
            <div className="skill-bubble b2">SQL +80XP</div>
            <div className="skill-bubble b3">Systems +200XP</div>
            <div className="skill-bubble b4">DevOps +150XP</div>
          </div>
        </GlassCard>

        {/* =========================================================================
            TILE 5: MENTORSHIP EXCHANGE
           ========================================================================= */}
        <GlassCard className="bento-tile">
          <div className="bento-header">
            <MessageSquare size={20} className="bento-icon" style={{ color: '#0A6E6E' }} />
            <h3>Mentorship Exchange</h3>
          </div>
          <p className="bento-desc">
            Connect directly with verified mentors who have successfully switched.
          </p>

          <div className="bento-widget-mentor">
            <div className="mentor-carousel-card">
              <div className="mentor-avatar">{mentors[mentorIndex].avatar}</div>
              <div className="mentor-info">
                <strong>{mentors[mentorIndex].name}</strong>
                <span>{mentors[mentorIndex].role}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span className="mentor-status-tag">Verified Advisor</span>
              <button 
                className="btn-next-mentor"
                onClick={() => setMentorIndex((mentorIndex + 1) % mentors.length)}
              >
                Next Mentor <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* =========================================================================
            TILE 6: CONTENT-TO-ROADMAP
           ========================================================================= */}
        <GlassCard className="bento-tile">
          <div className="bento-header">
            <FileJson size={20} className="bento-icon" style={{ color: '#FF6B6B' }} />
            <h3>Content-to-Roadmap</h3>
          </div>
          <p className="bento-desc">
            Paste any career blog URL or resume summary to generate a target roadmap instantly.
          </p>

          <div className="bento-widget-engine">
            <form onSubmit={handleSimulateEngine} className="engine-form">
              <input
                type="text"
                placeholder="Paste story link or role descriptor..."
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                disabled={engineStatus !== 'idle'}
              />
              <button type="submit" disabled={engineStatus !== 'idle'}>
                {engineStatus === 'idle' && <ArrowRight size={14} />}
                {engineStatus === 'analyzing' && <div className="spinner-mini" />}
                {engineStatus === 'success' && <Check size={14} />}
              </button>
            </form>

            <AnimatePresence>
              {engineStatus === 'analyzing' && (
                <motion.div 
                  className="engine-status-msg"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Analyzing career path dependencies...
                </motion.div>
              )}
              {engineStatus === 'success' && (
                <motion.div 
                  className="engine-status-msg success"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  🚀 Roadmap timeline generated successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
