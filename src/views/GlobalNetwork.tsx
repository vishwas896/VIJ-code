'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Zap, MapPin, MessageCircle, UserPlus, Search, Radio, ChevronRight, X, Plus, Minus, 
  LocateFixed, Globe, ShieldCheck, UserCheck, Compass, 
  Users, Calendar, Bookmark, BarChart3, Settings, SlidersHorizontal, 
  LayoutGrid, LayoutList, Check, UserMinus, CheckCircle, Network
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import './GlobalNetwork.css';

// ── TYPES ──
interface NetworkUser {
  id: number;
  name: string;
  role: string;
  company: string;
  skills: string[];
  lat: number;
  lng: number;
  status: 'online' | 'recent' | 'offline';
  matchPercent: number;
  isRecruiter: boolean;
  openToWork: boolean;
  isVerified: boolean;
  location: string;
  avatar: string;
  distance?: number;
}

// ── MOCK DATA ──
const MOCK_USERS: NetworkUser[] = [
  { id: 1, name: "Arjun Patel", role: "AI/ML Research Scientist", company: "VIJ Labs", skills: ["Python", "PyTorch", "NLP", "TensorFlow"], lat: 28.6139, lng: 77.2090, status: "online", matchPercent: 96, isRecruiter: false, openToWork: true, isVerified: true, location: "New Delhi, India", avatar: "AP" },
  { id: 2, name: "Priya Sharma", role: "Lead Frontend Architect", company: "InnovaTech", skills: ["React", "TypeScript", "Next.js", "Tailwind"], lat: 19.0760, lng: 72.8777, status: "online", matchPercent: 94, isRecruiter: false, openToWork: false, isVerified: true, location: "Mumbai, India", avatar: "PS" },
  { id: 3, name: "Sarah Chen", role: "Senior UX Designer", company: "DesignSpace", skills: ["Figma", "Design Systems", "Prototyping", "UI Design"], lat: 37.7749, lng: -122.4194, status: "recent", matchPercent: 88, isRecruiter: false, openToWork: true, isVerified: false, location: "San Francisco, USA", avatar: "SC" },
  { id: 4, name: "Michael Ross", role: "Hiring Manager / Tech Recruiter", company: "Fintech Scaleup", skills: ["Sourcing", "Technical Recruiting", "HR Tech"], lat: 40.7128, lng: -74.0060, status: "online", matchPercent: 82, isRecruiter: true, openToWork: false, isVerified: true, location: "New York, USA", avatar: "MR" },
  { id: 5, name: "Hans Müller", role: "DevOps & Cloud Engineer", company: "CyberShield Systems", skills: ["Docker", "Kubernetes", "AWS", "Terraform"], lat: 52.5200, lng: 13.4050, status: "offline", matchPercent: 79, isRecruiter: false, openToWork: false, isVerified: true, location: "Berlin, Germany", avatar: "HM" },
  { id: 6, name: "Elena Rossi", role: "Backend Node.js Architect", company: "Verdant Cloud", skills: ["Node.js", "Express", "GraphQL", "PostgreSQL"], lat: 41.9028, lng: 12.4964, status: "online", matchPercent: 91, isRecruiter: false, openToWork: true, isVerified: false, location: "Rome, Italy", avatar: "ER" },
  { id: 7, name: "Amit Verma", role: "Data Platform Architect", company: "Capital Solutions", skills: ["Python", "Spark", "Scala", "AWS Glue"], lat: 12.9716, lng: 77.5946, status: "recent", matchPercent: 85, isRecruiter: false, openToWork: false, isVerified: true, location: "Bengaluru, India", avatar: "AV" },
  { id: 8, name: "Neha Gupta", role: "Product Innovation Director", company: "Nexus Apps", skills: ["Product Roadmap", "Agile", "User Research"], lat: 28.7041, lng: 77.1025, status: "online", matchPercent: 92, isRecruiter: false, openToWork: false, isVerified: true, location: "Gurugram, India", avatar: "NG" },
  { id: 9, name: "David Miller", role: "Senior Recruiter", company: "Global Talent Corp", skills: ["Executive Search", "HR Consulting", "Recruiting"], lat: 51.5074, lng: -0.1278, status: "offline", matchPercent: 75, isRecruiter: true, openToWork: false, isVerified: false, location: "London, UK", avatar: "DM" },
  { id: 10, name: "Yuki Tanaka", role: "Mobile Software Engineer", company: "Kono Mobile", skills: ["Swift", "Kotlin", "React Native"], lat: 35.6762, lng: 139.6503, status: "online", matchPercent: 89, isRecruiter: false, openToWork: true, isVerified: true, location: "Tokyo, Japan", avatar: "YT" },
  { id: 11, name: "Carlos Mendez", role: "Full Stack Engineer", company: "Solaris Tech", skills: ["React", "Ruby on Rails", "PostgreSQL"], lat: 19.4326, lng: -99.1332, status: "recent", matchPercent: 87, isRecruiter: false, openToWork: false, isVerified: false, location: "Mexico City, Mexico", avatar: "CM" },
  { id: 12, name: "Fatima Al-Rashid", role: "Security Engineer", company: "CyberFort", skills: ["Penetration Testing", "Security Auditing", "OAuth"], lat: 25.2048, lng: 55.2708, status: "online", matchPercent: 90, isRecruiter: false, openToWork: false, isVerified: true, location: "Dubai, UAE", avatar: "FA" }
];

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const GlobalNetwork: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // ── NETWORK STATE ──
  const [connections, setConnections] = useState<{ connection_id: number; status: 'connected' | 'requested_sent' | 'requested_received'; created_at: string }[]>([]);

  const [preferences, setPreferences] = useState({
    map_visibility: 'public',
    preferred_industries: 'all',
    nearby_radius: 50,
    card_layout: 'grid',
    theme_mode: 'light'
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConnections = localStorage.getItem(`vij_connections_${userId}`);
      if (savedConnections) {
        try {
          setConnections(JSON.parse(savedConnections));
        } catch (e) {}
      } else {
        setConnections([
          { connection_id: 3, status: 'connected', created_at: new Date().toISOString() },
          { connection_id: 5, status: 'requested_received', created_at: new Date().toISOString() },
          { connection_id: 8, status: 'requested_sent', created_at: new Date().toISOString() }
        ]);
      }

      const savedPrefs = localStorage.getItem(`vij_network_preferences_${userId}`);
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
        } catch (e) {}
      }

      const savedBookmarks = localStorage.getItem(`vij_bookmarks_${userId}`);
      if (savedBookmarks) {
        try {
          setBookmarkedIds(JSON.parse(savedBookmarks));
        } catch (e) {}
      }
    }
  }, [userId]);

  // UI Local states
  const [activeSidebarTab, setActiveSidebarTab] = useState<'discover' | 'connections' | 'requests' | 'nearby' | 'groups' | 'events' | 'saved'>('discover');
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'discover' | 'connections' | 'insights'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Map filters
  const [mapFilter, setMapFilter] = useState<{
    onlineOnly: boolean;
    recruitersOnly: boolean;
    openToWorkOnly: boolean;
    verifiedOnly: boolean;
  }>({
    onlineOnly: false,
    recruitersOnly: false,
    openToWorkOnly: false,
    verifiedOnly: false
  });

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Sync to database triggers
  const saveConnections = (updated: any) => {
    setConnections(updated);
    localStorage.setItem(`vij_connections_${userId}`, JSON.stringify(updated));
  };

  const savePreferences = (updated: any) => {
    setPreferences(updated);
    localStorage.setItem(`vij_network_preferences_${userId}`, JSON.stringify(updated));
  };

  const toggleBookmark = (id: number, name: string) => {
    const updated = bookmarkedIds.includes(id) 
      ? bookmarkedIds.filter(bId => bId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem(`vij_bookmarks_${userId}`, JSON.stringify(updated));
    showToast(bookmarkedIds.includes(id) ? `Removed ${name} from saved profiles.` : `Saved ${name}'s profile.`);
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Geolocation Setup
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setMyLocation({ lat: 28.6139, lng: 77.2090 }) // Default to Delhi coordinates
    );
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    
    const worldBounds = L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180));
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      maxBounds: worldBounds,
      worldCopyJump: true
    });

    // Light Theme Tile Layer: Voyager
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      noWrap: true,
      bounds: worldBounds,
    }).addTo(map);

    mapInstance.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Sync My Location Marker
  const myMarkerRef = useRef<L.Marker | null>(null);
  useEffect(() => {
    if (myLocation && mapInstance.current) {
      if (myMarkerRef.current) myMarkerRef.current.remove();
      
      const myIcon = L.divIcon({
        className: 'gn-live-pulse-marker',
        html: `
          <div class="gn-pulse-ring" style="background: rgba(59, 130, 246, 0.2); box-shadow: 0 0 10px rgba(59, 130, 246, 0.4)"></div>
          <div class="gn-pulse-dot" style="background: #3b82f6"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      myMarkerRef.current = L.marker([myLocation.lat, myLocation.lng], { icon: myIcon })
        .addTo(mapInstance.current)
        .bindPopup(`<div style="padding: 8px; font-weight: 700; font-size:12px; color:#1e293b;">You are here</div>`);
    }
  }, [myLocation]);

  // Compute distances dynamically
  const usersWithDist = useMemo(() => {
    if (!myLocation) return MOCK_USERS.map(u => ({ ...u, distance: 9999 }));
    return MOCK_USERS.map(u => ({
      ...u,
      distance: Math.round(haversine(myLocation.lat, myLocation.lng, u.lat, u.lng))
    }));
  }, [myLocation]);

  // Filters mapping
  const filteredUsers = useMemo(() => {
    return usersWithDist.filter(u => {
      // Sidebar tab filtering
      if (activeSidebarTab === 'connections') {
        const record = connections.find(c => c.connection_id === u.id);
        if (!record || record.status !== 'connected') return false;
      }
      if (activeSidebarTab === 'requests') {
        const record = connections.find(c => c.connection_id === u.id);
        if (!record || record.status !== 'requested_received') return false;
      }
      if (activeSidebarTab === 'nearby') {
        if ((u.distance || 9999) > preferences.nearby_radius) return false;
      }
      if (activeSidebarTab === 'saved') {
        if (!bookmarkedIds.includes(u.id)) return false;
      }

      // Map sidebar specific checkboxes / filters
      if (mapFilter.onlineOnly && u.status !== 'online') return false;
      if (mapFilter.recruitersOnly && !u.isRecruiter) return false;
      if (mapFilter.openToWorkOnly && !u.openToWork) return false;
      if (mapFilter.verifiedOnly && !u.isVerified) return false;

      // Text search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesRole = u.role.toLowerCase().includes(q);
        const matchesCompany = u.company.toLowerCase().includes(q);
        const matchesSkills = u.skills.some(s => s.toLowerCase().includes(q));
        const matchesLoc = u.location.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesCompany && !matchesSkills && !matchesLoc) return false;
      }

      return true;
    });
  }, [usersWithDist, activeSidebarTab, connections, bookmarkedIds, preferences.nearby_radius, mapFilter, searchQuery]);

  // Update Map Markers
  useEffect(() => {
    if (!markersRef.current || !mapInstance.current) return;
    markersRef.current.clearLayers();

    filteredUsers.forEach(u => {
      const color = u.isRecruiter ? '#8b5cf6' : u.openToWork ? '#10b981' : u.status === 'online' ? '#3b82f6' : '#94a3b8';
      
      const customIcon = L.divIcon({
        className: 'gn-live-pulse-marker',
        html: `
          <div class="gn-pulse-ring" style="background: ${color}22; box-shadow: 0 0 10px ${color}44"></div>
          <div class="gn-pulse-dot" style="background: ${color}"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([u.lat, u.lng], { icon: customIcon });

      // Custom popups
      const popupContent = `
        <div class="gn-map-popup-body">
          <div class="gn-popup-header">
            <div class="gn-popup-avatar" style="${u.isRecruiter ? 'background: linear-gradient(135deg, #7c3aed, #a855f7);' : ''}">${u.avatar}</div>
            <div class="gn-popup-title">
              <strong>${u.name}</strong>
              <span>${u.role}</span>
            </div>
          </div>
          <div class="gn-popup-footer">
            <span>${u.matchPercent}% Match</span>
            ${u.distance ? `<span>${u.distance} km</span>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { closeButton: false, offset: [0, -4] });
      
      marker.on('mouseover', function(this: L.Marker) { this.openPopup(); });
      marker.on('mouseout', function(this: L.Marker) { this.closePopup(); });
      marker.on('click', () => {
        setSelectedUser(u);
        mapInstance.current?.setView([u.lat, u.lng], 8);
      });

      markersRef.current?.addLayer(marker);
    });
  }, [filteredUsers]);

  // Handle Connections
  const handleConnectClick = (id: number, name: string) => {
    const record = connections.find(c => c.connection_id === id);
    if (!record) {
      // Send Request
      const updated = [...connections, { connection_id: id, status: 'requested_sent' as const, created_at: new Date().toISOString() }];
      saveConnections(updated);
      showToast(`Connection request sent to ${name}!`);
    } else if (record.status === 'requested_sent') {
      // Cancel request
      const updated = connections.filter(c => c.connection_id !== id);
      saveConnections(updated);
      showToast(`Cancelled request to ${name}.`);
    } else if (record.status === 'requested_received') {
      // Accept Request
      const updated = connections.map(c => c.connection_id === id ? { ...c, status: 'connected' as const } : c);
      saveConnections(updated);
      showToast(`You are now connected with ${name}!`);
    }
  };

  const handleDisconnect = (id: number, name: string) => {
    const updated = connections.filter(c => c.connection_id !== id);
    saveConnections(updated);
    showToast(`Removed ${name} from your network.`);
  };

  // Connection count calculations
  const connectedCount = useMemo(() => connections.filter(c => c.status === 'connected').length, [connections]);
  const requestsCount = useMemo(() => connections.filter(c => c.status === 'requested_received').length, [connections]);

  // Network Strength Progress
  const networkStrength = useMemo(() => {
    const base = Math.min(100, connectedCount * 12 + bookmarkedIds.length * 5);
    return base === 0 ? 15 : base; // default baseline strength
  }, [connectedCount, bookmarkedIds]);

  return (
    <div className="gn-ecosystem-root">
      
      {/* ── LIVE TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            className="gn-toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <CheckCircle size={16} style={{ color: '#3b82f6' }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="gn-page-container">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="gn-sidebar-left">
          <div className="gn-glass-panel">
            <div className="gn-nav-menu">
              <div 
                className={`gn-nav-item ${activeSidebarTab === 'discover' ? 'active' : ''}`}
                onClick={() => { setActiveSidebarTab('discover'); setActiveMobileTab('discover'); }}
              >
                <Compass size={16} />
                <span>Discover Talent</span>
              </div>
              <div 
                className={`gn-nav-item ${activeSidebarTab === 'connections' ? 'active' : ''}`}
                onClick={() => { setActiveSidebarTab('connections'); setActiveMobileTab('connections'); }}
              >
                <Network size={16} />
                <span>My Connections</span>
                {connectedCount > 0 && <span className="gn-nav-badge">{connectedCount}</span>}
              </div>
              <div 
                className={`gn-nav-item ${activeSidebarTab === 'requests' ? 'active' : ''}`}
                onClick={() => { setActiveSidebarTab('requests'); setActiveMobileTab('connections'); }}
              >
                <UserCheck size={16} />
                <span>Requests</span>
                {requestsCount > 0 && <span className="gn-nav-badge urgent">{requestsCount}</span>}
              </div>
              <div 
                className={`gn-nav-item ${activeSidebarTab === 'nearby' ? 'active' : ''}`}
                onClick={() => { setActiveSidebarTab('nearby'); setActiveMobileTab('discover'); }}
              >
                <MapPin size={16} />
                <span>Nearby People</span>
              </div>

              <div className="gn-divider" />

              <div className="gn-nav-item">
                <Users size={16} />
                <span>Industry Groups</span>
                <span className="gn-nav-badge">6</span>
              </div>
              <div className="gn-nav-item">
                <Calendar size={16} />
                <span>Events</span>
              </div>
              <div 
                className={`gn-nav-item ${activeSidebarTab === 'saved' ? 'active' : ''}`}
                onClick={() => { setActiveSidebarTab('saved'); setActiveMobileTab('discover'); }}
              >
                <Bookmark size={16} />
                <span>Saved Profiles</span>
                {bookmarkedIds.length > 0 && <span className="gn-nav-badge">{bookmarkedIds.length}</span>}
              </div>
            </div>
          </div>
          
          {/* Quick Active Status */}
          <div className="gn-glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio size={16} style={{ color: '#22c55e' }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Radar Scanner</span>
                <strong style={{ display: 'block', fontSize: '12px', color: '#1e293b' }}>Active Globally</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* ── CENTER AREA: MAP AND DISCOVER ── */}
        <main className="gn-center-content">
          
          {/* Smart Search Bar */}
          <div className="gn-search-wrapper">
            <div className="gn-search-main">
              <Search size={18} style={{ color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search professionals by name, company, role, location or skills..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <SlidersHorizontal size={18} style={{ color: '#64748b', cursor: 'pointer' }} />
            </div>

            {/* Simulated Suggestions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Try AI Suggestion:</span>
              <button 
                className="gn-filter-pill"
                onClick={() => setSearchQuery('React')}
              >
                Developers matching my stack
              </button>
              <button 
                className="gn-filter-pill"
                onClick={() => setSearchQuery('Figma')}
              >
                Designers similar to my interests
              </button>
              {searchQuery && (
                <button 
                  className="gn-filter-pill danger"
                  onClick={() => setSearchQuery('')}
                  style={{ color: '#ef4444' }}
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Interactive World Map */}
          {((activeMobileTab === 'map') || (window.innerWidth > 768)) && (
            <div className="gn-map-panel">
              <div id="map" ref={mapRef} className="gn-map-container" />

              {/* Map Floating Controls */}
              <div className="gn-map-controls-group">
                <button className="gn-map-ctrl-btn" onClick={() => mapInstance.current?.zoomIn()} title="Zoom In"><Plus size={18} /></button>
                <button className="gn-map-ctrl-btn" onClick={() => mapInstance.current?.zoomOut()} title="Zoom Out"><Minus size={18} /></button>
                <button 
                  className="gn-map-ctrl-btn" 
                  onClick={() => {
                    if (myLocation) {
                      mapInstance.current?.setView([myLocation.lat, myLocation.lng], 10);
                    }
                  }} 
                  title="My Location"
                >
                  <LocateFixed size={18} />
                </button>
                <button className="gn-map-ctrl-btn" onClick={() => mapInstance.current?.setView([20, 0], 2)} title="Whole Globe"><Globe size={18} /></button>
              </div>

              {/* Map Legend */}
              <div className="gn-map-legend">
                <div className="gn-map-legend-item">
                  <i style={{ background: '#3b82f6' }} />
                  <span>Online</span>
                </div>
                <div className="gn-map-legend-item">
                  <i style={{ background: '#8b5cf6' }} />
                  <span>Recruiters</span>
                </div>
                <div className="gn-map-legend-item">
                  <i style={{ background: '#10b981' }} />
                  <span>Hiring</span>
                </div>
              </div>
            </div>
          )}

          {/* Map Filters Bar */}
          <div className="gn-filter-pills">
            <button 
              className={`gn-filter-pill ${mapFilter.onlineOnly ? 'active' : ''}`}
              onClick={() => setMapFilter(prev => ({ ...prev, onlineOnly: !prev.onlineOnly }))}
            >
              Online Active
            </button>
            <button 
              className={`gn-filter-pill ${mapFilter.recruitersOnly ? 'active' : ''}`}
              onClick={() => setMapFilter(prev => ({ ...prev, recruitersOnly: !prev.recruitersOnly }))}
            >
              Recruiters
            </button>
            <button 
              className={`gn-filter-pill ${mapFilter.openToWorkOnly ? 'active' : ''}`}
              onClick={() => setMapFilter(prev => ({ ...prev, openToWorkOnly: !prev.openToWorkOnly }))}
            >
              Open To Work
            </button>
            <button 
              className={`gn-filter-pill ${mapFilter.verifiedOnly ? 'active' : ''}`}
              onClick={() => setMapFilter(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
            >
              Verified Matches
            </button>
          </div>

          {/* Discover Grid Area */}
          {((activeMobileTab === 'discover' || activeMobileTab === 'connections') || (window.innerWidth > 768)) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="gn-section-header">
                <h3>
                  {activeSidebarTab === 'discover' && 'Recommended for you'}
                  {activeSidebarTab === 'connections' && 'Your Connections'}
                  {activeSidebarTab === 'requests' && 'Pending Invitations'}
                  {activeSidebarTab === 'nearby' && 'Professionals Nearby'}
                  {activeSidebarTab === 'saved' && 'Bookmarked Profiles'}
                </h3>
                
                <div className="gn-layout-toggles">
                  <button 
                    className={`gn-layout-btn ${preferences.card_layout === 'grid' ? 'active' : ''}`}
                    onClick={() => savePreferences({ ...preferences, card_layout: 'grid' })}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    className={`gn-layout-btn ${preferences.card_layout === 'list' ? 'active' : ''}`}
                    onClick={() => savePreferences({ ...preferences, card_layout: 'list' })}
                  >
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="gn-glass-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <Users size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                  <h4 style={{ margin: '0 0 4px', color: '#1e293b' }}>No connections found</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Try broadening your filters or updating your search query.</p>
                </div>
              ) : (
                <div className={`gn-people-grid ${preferences.card_layout === 'list' ? 'list-view' : ''}`}>
                  {filteredUsers.map(u => {
                    const statusRecord = connections.find(c => c.connection_id === u.id);
                    const isConnected = statusRecord?.status === 'connected';
                    const isRequested = statusRecord?.status === 'requested_sent';
                    const isPendingApproval = statusRecord?.status === 'requested_received';

                    return (
                      <div 
                        key={u.id} 
                        className={`gn-people-card ${isConnected ? 'connected-card' : ''}`}
                        onClick={() => setSelectedUser(u)}
                      >
                        <div className="gn-card-top-row">
                          <div className="gn-card-avatar-area">
                            <div className={`gn-card-avatar ${u.isRecruiter ? 'recruiter' : ''}`}>
                              {u.avatar}
                            </div>
                            <span className={`gn-online-status-dot ${u.status}`} />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <div className="gn-match-badge">
                              <Zap size={10} fill="currentColor" />
                              <span>{u.matchPercent}% Match</span>
                            </div>
                            {u.isRecruiter && (
                              <span style={{ fontSize: '9px', fontWeight: 800, background: '#f5f3ff', color: '#7c3aed', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd6fe' }}>RECRUITER</span>
                            )}
                            {u.openToWork && (
                              <span style={{ fontSize: '9px', fontWeight: 800, background: '#ecfdf5', color: '#10b981', padding: '2px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>HIRING</span>
                            )}
                          </div>
                        </div>

                        <div className="gn-card-identity">
                          <h4>
                            {u.name}
                            {u.isVerified && <ShieldCheck size={14} style={{ color: '#3b82f6', fill: '#3b82f622' }} />}
                          </h4>
                          <p className="gn-card-role">{u.role}</p>
                          <p className="gn-card-company">{u.company} • {u.location}</p>
                        </div>

                        {u.distance && (
                          <div className="gn-card-meta">
                            <div className="gn-card-meta-item">
                              <MapPin size={11} />
                              <span>{u.distance < 1 ? '<1' : u.distance} km away</span>
                            </div>
                          </div>
                        )}

                        <div className="gn-card-skills-row">
                          {u.skills.map(s => (
                            <span key={s} className="gn-card-skill-tag">{s}</span>
                          ))}
                        </div>

                        <div className="gn-card-actions-row" onClick={e => e.stopPropagation()}>
                          {isConnected ? (
                            <>
                              <button className="gn-card-btn outline">
                                <MessageCircle size={12} />
                                <span>Message</span>
                              </button>
                              <button 
                                className="gn-card-btn outline"
                                onClick={() => handleDisconnect(u.id, u.name)}
                                title="Disconnect"
                                style={{ flex: '0 0 36px', padding: 0 }}
                              >
                                <UserMinus size={12} style={{ color: '#ef4444' }} />
                              </button>
                            </>
                          ) : isRequested ? (
                            <button 
                              className="gn-card-btn outline danger"
                              onClick={() => handleConnectClick(u.id, u.name)}
                            >
                              <X size={12} />
                              <span>Cancel</span>
                            </button>
                          ) : isPendingApproval ? (
                            <>
                              <button 
                                className="gn-card-btn primary"
                                onClick={() => handleConnectClick(u.id, u.name)}
                              >
                                <Check size={12} />
                                <span>Accept</span>
                              </button>
                              <button 
                                className="gn-card-btn outline"
                                onClick={() => handleDisconnect(u.id, u.name)}
                                style={{ flex: '0 0 36px', padding: 0 }}
                              >
                                <X size={12} style={{ color: '#ef4444' }} />
                              </button>
                            </>
                          ) : (
                            <button 
                              className="gn-card-btn primary"
                              onClick={() => handleConnectClick(u.id, u.name)}
                            >
                              <UserPlus size={12} />
                              <span>Connect</span>
                            </button>
                          )}

                          <button 
                            className="gn-card-btn outline"
                            onClick={() => toggleBookmark(u.id, u.name)}
                            style={{ flex: '0 0 36px', padding: 0 }}
                          >
                            <Bookmark size={12} style={{ fill: bookmarkedIds.includes(u.id) ? '#3b82f6' : 'none', color: bookmarkedIds.includes(u.id) ? '#3b82f6' : '#64748b' }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>

        {/* ── RIGHT INSIGHTS SIDEBAR ── */}
        <aside className="gn-sidebar-right">
          
          {/* Network Strength Widget */}
          <div className="gn-glass-panel">
            <div className="gn-widget-header">Network Analytics</div>
            <div className="gn-strength-box" style={{ marginTop: '10px' }}>
              <div className="gn-strength-circle-wrapper">
                <svg width="60" height="60" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#accentGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${networkStrength}, 100`}
                  />
                  <defs>
                    <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="gn-strength-val">{networkStrength}%</div>
              </div>
              <div className="gn-strength-info">
                <h5>Network Strength</h5>
                <p>Based on connection diversity & verified matches.</p>
              </div>
            </div>
            
            {/* Simulated Growth Chart */}
            <div style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Connection Growth (Weekly)</span>
              <div className="gn-growth-chart">
                <div className="gn-chart-bar-wrap"><div className="gn-chart-bar" style={{ height: '12px' }} /><span className="gn-chart-label">W1</span></div>
                <div className="gn-chart-bar-wrap"><div className="gn-chart-bar" style={{ height: '22px' }} /><span className="gn-chart-label">W2</span></div>
                <div className="gn-chart-bar-wrap"><div className="gn-chart-bar" style={{ height: '18px' }} /><span className="gn-chart-label">W3</span></div>
                <div className="gn-chart-bar-wrap"><div className="gn-chart-bar" style={{ height: '34px' }} /><span className="gn-chart-label">W4</span></div>
              </div>
            </div>
          </div>

          {/* Hiring Hotspots Widget */}
          <div className="gn-glass-panel">
            <div className="gn-widget-header">Hiring Hotspots</div>
            <div className="gn-list-small" style={{ marginTop: '10px' }}>
              <div className="gn-list-item-small">
                <div className="gn-item-icon-small"><Globe size={14} /></div>
                <div className="gn-item-text-small">
                  <strong>Bengaluru, IN</strong>
                  <span>2.4k Job postings this week</span>
                </div>
              </div>
              <div className="gn-list-item-small">
                <div className="gn-item-icon-small"><Globe size={14} /></div>
                <div className="gn-item-text-small">
                  <strong>San Francisco, US</strong>
                  <span>1.8k Job postings this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings & Preferences customization */}
          <div className="gn-glass-panel">
            <div className="gn-widget-header"><Settings size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Preferences</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              
              <div className="gn-pref-row">
                <label>Nearby Radius</label>
                <div className="gn-slider-container">
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    value={preferences.nearby_radius} 
                    onChange={e => savePreferences({ ...preferences, nearby_radius: parseInt(e.target.value) })}
                  />
                  <span className="gn-slider-val">{preferences.nearby_radius}km</span>
                </div>
              </div>

              <div className="gn-pref-row">
                <label>Map Visibility</label>
                <select 
                  value={preferences.map_visibility} 
                  onChange={e => savePreferences({ ...preferences, map_visibility: e.target.value })}
                >
                  <option value="public">Show to everyone</option>
                  <option value="connections">Only connections</option>
                  <option value="private">Hide my location</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <div className="gn-mobile-nav">
        <button 
          className={`gn-mobile-nav-item ${activeMobileTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('map')}
        >
          <Globe size={18} />
          <span>Live Map</span>
        </button>
        <button 
          className={`gn-mobile-nav-item ${activeMobileTab === 'discover' ? 'active' : ''}`}
          onClick={() => { setActiveMobileTab('discover'); setActiveSidebarTab('discover'); }}
        >
          <Compass size={18} />
          <span>Discover</span>
        </button>
        <button 
          className={`gn-mobile-nav-item ${activeMobileTab === 'connections' ? 'active' : ''}`}
          onClick={() => { setActiveMobileTab('connections'); setActiveSidebarTab('connections'); }}
        >
          <Network size={18} />
          <span>Connections</span>
        </button>
        <button 
          className={`gn-mobile-nav-item ${activeMobileTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('insights')}
        >
          <BarChart3 size={18} />
          <span>Insights</span>
        </button>
      </div>

      {/* ── USER DETAIL DRAWER OVERLAY ── */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            className="gn-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div 
              className="gn-drawer"
              initial={{ x: 440 }}
              animate={{ x: 0 }}
              exit={{ x: 440 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="gn-drawer-close" onClick={() => setSelectedUser(null)}>
                <X size={16} />
              </button>

              <div className="gn-drawer-profile">
                <div className={`gn-card-avatar ${selectedUser.isRecruiter ? 'recruiter' : ''}`} style={{ width: '80px', height: '80px', fontSize: '24px' }}>
                  {selectedUser.avatar}
                </div>
                <h2>{selectedUser.name}</h2>
                <p>{selectedUser.role} at <strong>{selectedUser.company}</strong></p>
                
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                  <div className="gn-match-badge">
                    <Zap size={10} fill="currentColor" />
                    <span>{selectedUser.matchPercent}% Match</span>
                  </div>
                  {selectedUser.isVerified && (
                    <span style={{ fontSize: '10px', background: '#eff6ff', color: '#3b82f6', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid #dbeafe', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="gn-drawer-section">
                <h4>Verified Skills</h4>
                <div className="gn-card-skills-row">
                  {selectedUser.skills.map(s => (
                    <span key={s} className="gn-card-skill-tag" style={{ fontSize: '11px', padding: '4px 8px' }}>{s}</span>
                  ))}
                </div>
              </div>

              <div className="gn-drawer-section">
                <h4>Bio & Location</h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: '0 0 10px' }}>
                  Professional networking and community mapping profile. Open to discussing roles, sharing roadmaps, and collaborating on open-source systems.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
                  <MapPin size={14} />
                  <span>{selectedUser.location} {selectedUser.distance ? `(${selectedUser.distance} km away)` : ''}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '32px' }}>
                {connections.some(c => c.connection_id === selectedUser.id && c.status === 'connected') ? (
                  <>
                    <button className="gn-card-btn primary" style={{ padding: '12px' }}>
                      <MessageCircle size={14} />
                      <span>Start Conversation</span>
                    </button>
                    <button 
                      className="gn-card-btn danger" 
                      style={{ padding: '12px' }}
                      onClick={() => {
                        handleDisconnect(selectedUser.id, selectedUser.name);
                        setSelectedUser(null);
                      }}
                    >
                      <UserMinus size={14} />
                      <span>Disconnect</span>
                    </button>
                  </>
                ) : connections.some(c => c.connection_id === selectedUser.id && c.status === 'requested_sent') ? (
                  <button 
                    className="gn-card-btn danger" 
                    style={{ padding: '12px' }}
                    onClick={() => {
                      handleConnectClick(selectedUser.id, selectedUser.name);
                      setSelectedUser(null);
                    }}
                  >
                    <X size={14} />
                    <span>Cancel Request</span>
                  </button>
                ) : (
                  <button 
                    className="gn-card-btn primary" 
                    style={{ padding: '12px' }}
                    onClick={() => handleConnectClick(selectedUser.id, selectedUser.name)}
                  >
                    <UserPlus size={14} />
                    <span>Connect Now</span>
                  </button>
                )}

                <button 
                  className="gn-card-btn outline" 
                  style={{ padding: '12px' }}
                  onClick={() => toggleBookmark(selectedUser.id, selectedUser.name)}
                >
                  <Bookmark size={14} style={{ fill: bookmarkedIds.includes(selectedUser.id) ? '#3b82f6' : 'none' }} />
                  <span>{bookmarkedIds.includes(selectedUser.id) ? 'Saved' : 'Save Profile'}</span>
                </button>
                
                <Link 
                  href={`/profile/${selectedUser.id}`} 
                  style={{ textDecoration: 'none', textAlign: 'center', color: '#3b82f6', fontSize: '13px', fontWeight: 700, marginTop: '16px' }}
                  onClick={() => setSelectedUser(null)}
                >
                  View Full Profile <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

