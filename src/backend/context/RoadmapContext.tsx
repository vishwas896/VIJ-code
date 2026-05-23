/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RoadmapProfileAnswers {
  industry: string;
  experienceLevel: 'fresher' | 'student' | 'employee' | '';
  currentCompany: string;
  preferredDomain: string;
}

interface RoadmapState {
  activePathId: string | null;
  completedNodes: string[];
  savedPaths: string[];
  likedPaths: string[];
  profileAnswers: RoadmapProfileAnswers | null;
}

interface RoadmapContextType {
  state: RoadmapState;
  startRoute: (id: string) => void;
  completeNode: (nodeId: string) => void;
  toggleSave: (id: string) => void;
  toggleLike: (id: string) => void;
  isNodeCompleted: (nodeId: string) => boolean;
  isPathSaved: (id: string) => boolean;
  isPathLiked: (id: string) => boolean;
  saveProfileAnswers: (answers: RoadmapProfileAnswers) => void;
  hasProfile: boolean;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<RoadmapState>(() => {
    const saved = localStorage.getItem('vij_roadmap_state');
    return saved ? JSON.parse(saved) : {
      activePathId: null,
      completedNodes: [],
      savedPaths: [],
      likedPaths: [],
      profileAnswers: null,
    };
  });

  useEffect(() => {
    localStorage.setItem('vij_roadmap_state', JSON.stringify(state));
  }, [state]);

  const startRoute = (id: string) => {
    setState(prev => ({ ...prev, activePathId: id }));
  };

  const completeNode = (nodeId: string) => {
    setState(prev => ({
      ...prev,
      completedNodes: prev.completedNodes.includes(nodeId)
        ? prev.completedNodes.filter(id => id !== nodeId)
        : [...prev.completedNodes, nodeId]
    }));
  };

  const toggleSave = (id: string) => {
    setState(prev => ({
      ...prev,
      savedPaths: prev.savedPaths.includes(id)
        ? prev.savedPaths.filter(pid => pid !== id)
        : [...prev.savedPaths, id]
    }));
  };

  const toggleLike = (id: string) => {
    setState(prev => ({
      ...prev,
      likedPaths: prev.likedPaths.includes(id)
        ? prev.likedPaths.filter(pid => pid !== id)
        : [...prev.likedPaths, id]
    }));
  };

  const saveProfileAnswers = (answers: RoadmapProfileAnswers) => {
    setState(prev => ({ ...prev, profileAnswers: answers }));
  };

  const isNodeCompleted = (nodeId: string) => state.completedNodes.includes(nodeId);
  const isPathSaved = (id: string) => state.savedPaths.includes(id);
  const isPathLiked = (id: string) => state.likedPaths.includes(id);
  const hasProfile = state.profileAnswers !== null;

  return (
    <RoadmapContext.Provider value={{
      state, startRoute, completeNode, toggleSave, toggleLike,
      isNodeCompleted, isPathSaved, isPathLiked, saveProfileAnswers, hasProfile
    }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmaps = () => {
  const context = useContext(RoadmapContext);
  if (!context) throw new Error('useRoadmaps must be used within a RoadmapProvider');
  return context;
};
