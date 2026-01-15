import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PenLine, ChevronRight, Trash2, LogOut, ChevronDown, Settings as SettingsIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format, isToday, differenceInDays, parseISO } from 'date-fns';
import StreakCounter from '@/components/home/StreakCounter';
import InventoryCard from '@/components/home/InventoryCard';
import InsightsChart from '@/components/home/InsightsChart';
import useTheme from '@/components/theme/useTheme';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export default function Home() {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    loadUser();
  }, [location]);
  
  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      if (!userData.recovery_status) {
        navigate(createPageUrl('Onboarding'));
        return;
      }
      setUser(userData);
    } catch (err) {
      navigate(createPageUrl('Onboarding'));
    }
  };

  // Reload user data every 2 seconds to keep it fresh
  useEffect(() => {
    const interval = setInterval(loadUser, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const { data: entries = [], isLoading, refetch } = useQuery({
    queryKey: ['inventoryEntries'],
    queryFn: () => base44.entities.InventoryEntry.list('-date', 50),
    enabled: !!user
  });

  // Check for draft
  const [draftExists, setDraftExists] = useState(false);
  
  useEffect(() => {
    const draft = localStorage.getItem('inventory_draft');
    setDraftExists(!!draft);
  }, [location]);

  const handleDeleteDraft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem('inventory_draft');
    setDraftExists(false);
  };

  const handleDeleteEntry = (deletedId) => {
    refetch();
  };
  
  // Calculate streak
  const calculateStreak = () => {
    if (!entries.length) return 0;
    
    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (streak === 0 && differenceInDays(today, entryDate) === 1) {
        // Allow for yesterday if no entry today yet
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const todayEntry = entries.find(e => isToday(parseISO(e.date)));
  const streak = calculateStreak();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-[#1F2C46] leading-tight">
              {getTimeBasedGreeting()}, {toTitleCase(user.full_name)?.split(' ')[0] || 'Friend'}
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-3 py-2 hover:shadow-md transition-shadow">
                <div className="relative">
                  <Avatar className="w-10 h-10 ring-2" style={{ borderColor: colors.primary, borderWidth: '2px' }}>
                    <AvatarImage src={user.profile_picture} alt={user.full_name} />
                    <AvatarFallback className="text-sm font-medium" style={{ background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`, color: 'white' }}>
                      {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-sm font-medium text-[#1F2C46]">{toTitleCase(user.full_name)?.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate(createPageUrl('Settings'))}>
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => base44.auth.logout()} className="text-red-600 focus:text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
        
        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <StreakCounter streak={streak} />
        </motion.div>
        
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Inventory')}>
            <div className="bg-white rounded-[25px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="flex items-center gap-4">
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${colors.shadow} group-hover:scale-105 transition-transform`}
                  style={{
                    background: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  <PenLine className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#1F2C46]">
                    {todayEntry ? "View Today's Reflection" : "Start Today's Inventory"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {todayEntry ? 'You already reflected today' : format(new Date(), 'EEEE, MMMM d')}
                  </p>
                </div>
                <ChevronRight 
                  className="w-6 h-6 text-gray-400 transition-colors"
                  style={{ color: 'var(--hover-color, #9ca3af)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                />
              </div>
            </div>
          </Link>
        </motion.div>
        
        {/* Weekly Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <InsightsChart entries={entries} />
        </motion.div>
        
        {/* Previous Inventories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1F2C46]">Saved Inventories</h3>
            <Link 
              to={createPageUrl('History')}
              className="text-xs px-3 py-1.5 rounded-full font-medium hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `${colors.primary}20`,
                color: '#000'
              }}
            >
              View All Inventories
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[20px] p-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center">
              <p className="text-gray-500">No reflections yet. Start your first inventory!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {draftExists && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <Link 
                    to={createPageUrl('Inventory')}
                    className="block bg-white rounded-[20px] p-5 shadow-sm border-2 border-dashed hover:shadow-md transition-all duration-300"
                    style={{ borderColor: colors.primary }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(to bottom right, ${colors.primary}20, ${colors.secondary}20)`
                          }}
                        >
                          <PenLine className="w-5 h-5" style={{ color: colors.primary }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-[#1F2C46]">{format(new Date(), 'EEEE, MMMM d')}</p>
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary
                              }}
                            >
                              Draft
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Continue your inventory</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDeleteDraft}
                          className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
              {entries.slice(0, 5).map((entry, index) => (
                <InventoryCard key={entry.id} entry={entry} index={index} onDelete={handleDeleteEntry} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}