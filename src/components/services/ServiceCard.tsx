'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Map, Activity, Compass, GitMerge, DollarSign, HelpCircle, 
  Target, Eye, FileText, Users, MessageSquare, BookOpen, 
  Sparkles, Cpu, Trophy, Globe, UserCheck, Newspaper, 
  Video, Wallet, Brain, ArrowUpRight
} from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';

// Icon mapping based on the item ID
const getIcon = (id: string, size = 20) => {
  switch (id) {
    case 'ai-roadmap': return <Map size={size} />;
    case 'scenario-simulator': return <Activity size={size} />;
    case 'skill-analyzer': return <Compass size={size} />;
    case 'pivot-explorer': return <GitMerge size={size} />;
    case 'salary-insights': return <DollarSign size={size} />;
    case 'interview-insights': return <HelpCircle size={size} />;
    
    case 'smart-matching': return <Target size={size} />;
    case 'anti-ghosting': return <Eye size={size} />;
    case 'resume-builder': return <FileText size={size} />;
    
    case 'mentorship-exchange': return <Users size={size} />;
    case 'community-bowls': return <MessageSquare size={size} />;
    case 'career-stories': return <BookOpen size={size} />;
    case 'top-voices': return <Sparkles size={size} />;
    case 'content-to-roadmap': return <Cpu size={size} />;
    case 'skill-challenges': return <Trophy size={size} />;
    
    case 'global-connections': return <Globe size={size} />;
    case 'professional-profile': return <UserCheck size={size} />;
    case 'news-pulse': return <Newspaper size={size} />;
    
    case 'interview-room': return <Video size={size} />;
    case 'web3-wallet': return <Wallet size={size} />;
    case 'ai-resume-reviewer': return <Brain size={size} />;
    
    default: return <Sparkles size={size} />;
  }
};

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  cta: string;
  link: string;
  isHighlighted: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  description,
  cta,
  link,
  isHighlighted
}) => {
  const router = useRouter();

  return (
    <GlassCard 
      className={`service-bento-card ${isHighlighted ? 'highlighted-feature' : ''}`}
      glowingEdge={isHighlighted ? 'azure' : 'none'}
      tilt={true}
      layout
    >
      <div className="service-card-header">
        <div className={`service-card-icon-wrapper ${isHighlighted ? 'highlight' : ''}`}>
          {getIcon(id, 24)}
        </div>
        {isHighlighted && (
          <span className="featured-badge">
            <Sparkles size={10} style={{ marginRight: '4px' }} />
            Recommended
          </span>
        )}
      </div>

      <div className="service-card-body">
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-desc">{description}</p>
      </div>

      <div className="service-card-footer">
        <GlassButton 
          variant={isHighlighted ? 'primary' : 'secondary'} 
          className="service-card-cta"
          onClick={() => router.push(link)}
          icon={<ArrowUpRight size={14} />}
        >
          {cta}
        </GlassButton>
      </div>
    </GlassCard>
  );
};

