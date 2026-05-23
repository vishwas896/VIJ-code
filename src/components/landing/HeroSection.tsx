import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, FileText, CheckCircle2 } from 'lucide-react';
import { GlassButton } from '../GlassButton';
import './landing.css';

interface TeaserNode {
  id: string;
  role: string;
  salaryJump: string;
  duration: string;
  difficulty: string;
  cx: number;
  cy: number;
  color: string;
}

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeNode, setActiveNode] = useState<TeaserNode | null>(null);

  // Particles for canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number }> = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(10, 110, 110, 0.05)';
      ctx.lineWidth = 0.6;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 110, 110, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const nodes: TeaserNode[] = [
    { id: 'n1', role: 'DevOps Lead', salaryJump: '+45%', duration: '12 Months', difficulty: 'Medium', cx: 50, cy: 60, color: '#FF6B6B' },
    { id: 'n2', role: 'Solutions Architect', salaryJump: '+55%', duration: '18 Months', difficulty: 'High', cx: 160, cy: 70, color: '#FF6B6B' },
    { id: 'n3', role: 'Product Manager', salaryJump: '+38%', duration: '14 Months', difficulty: 'Medium', cx: 60, cy: 150, color: '#FF6B6B' },
    { id: 'n4', role: 'UI/UX Lead', salaryJump: '+28%', duration: '8 Months', difficulty: 'Low', cx: 150, cy: 150, color: '#FF6B6B' }
  ];

  return (
    <section className="ld-hero">
      <canvas ref={canvasRef} className="ld-hero-canvas" />
      <div className="ld-hero-grid">
        <motion.div 
          className="ld-hero-text"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="ld-badge">
            <Sparkles size={12} color="#FF6B6B" />
            <span>Futuristic Career OS</span>
          </div>
          <h1>Your Career, Mapped by Experience — Not Guesswork.</h1>
          <p>
            AI-powered roadmaps, real-world salary simulators, and a community that actually answers back. Plan your next move with the clarity legacy portals never gave you.
          </p>

          {/* Trust badge row */}
          <div className="ld-hero-trust-strip" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '6px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 650, color: '#475569' }}>
              <CheckCircle2 size={15} color="#0A6E6E" />
              <span>50K+ Roadmaps Created</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 650, color: '#475569' }}>
              <CheckCircle2 size={15} color="#0A6E6E" />
              <span>2M+ Salary Reports</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 650, color: '#475569' }}>
              <CheckCircle2 size={15} color="#0A6E6E" />
              <span>94% Response Rate</span>
            </div>
          </div>

          <div className="ld-hero-actions">
            <GlassButton 
              variant="primary"
              onClick={() => navigate('/register')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FileText size={16} />
              Build Your Free Roadmap
            </GlassButton>
            <GlassButton 
              variant="secondary"
              onClick={() => {
                const works = document.getElementById('how-it-works-sect');
                if (works) works.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ borderColor: 'var(--color-teal-primary)', color: 'var(--color-teal-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={15} fill="var(--color-teal-primary)" />
              Watch How It Works
            </GlassButton>
          </div>
        </motion.div>

        <motion.div 
          className="ld-hero-visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="ld-visual-circle">
            <svg viewBox="0 0 200 200" className="ld-svg-net">
              {/* Central lines connecting center to outer nodes */}
              {nodes.map(node => (
                <line 
                  key={`line-${node.id}`}
                  x1="100" 
                  y1="100" 
                  x2={node.cx} 
                  y2={node.cy} 
                  stroke={activeNode?.id === node.id ? 'var(--color-coral-cta)' : '#0A6E6E'} 
                  strokeWidth={activeNode?.id === node.id ? '1.5' : '0.8'} 
                  strokeDasharray={activeNode?.id === node.id ? 'none' : '3'}
                  style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                />
              ))}

              {/* Center Root Node */}
              <circle cx="100" cy="100" r="14" fill="#0A6E6E" className="pulse-circle" style={{ cursor: 'pointer' }} />
              <text x="100" y="103" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>YOU</text>

              {/* Outer nodes */}
              {nodes.map(node => (
                <circle 
                  key={node.id}
                  cx={node.cx} 
                  cy={node.cy} 
                  r="9" 
                  fill={node.color} 
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={() => setActiveNode(node)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => setActiveNode(node)}
                />
              ))}
            </svg>

            {/* Micro tooltip interactive card */}
            <AnimatePresence>
              {activeNode ? (
                <motion.div 
                  className="ld-visual-card"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{ position: 'absolute', top: '105%', width: '190px' }}
                >
                  <strong style={{ color: 'var(--color-teal-primary)' }}>{activeNode.role}</strong>
                  <span className="txt-coral" style={{ fontSize: '14px', margin: '4px 0 2px' }}>
                    {activeNode.salaryJump} Salary Jump
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '4px', marginTop: '4px' }}>
                    <span>{activeNode.duration}</span>
                    <span>{activeNode.difficulty} Gap</span>
                  </div>
                </motion.div>
              ) : (
                <div className="ld-visual-card" style={{ position: 'absolute', top: '105%' }}>
                  <strong>Hover Node Nodes</strong>
                  <span className="txt-coral" style={{ fontSize: '13px', marginTop: '2px' }}>Compare Pivots</span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
