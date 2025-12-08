import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Calendar } from 'lucide-react';
import InventoryCard from '@/components/home/InventoryCard';

export default function History() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadUser();
  }, []);
  
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
  
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['allInventoryEntries'],
    queryFn: () => base44.entities.InventoryEntry.list('-date', 100),
    enabled: !!user
  });
  
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7667E5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F7] via-white to-[#E1E1E5]">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to={createPageUrl('Home')}
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#1F2C46]">All Reflections</h1>
            <p className="text-sm text-gray-500">{entries.length} entries</p>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[25px] p-8 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#7667E5]/10 to-[#A48FFF]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[#7667E5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2C46] mb-2">No reflections yet</h3>
            <p className="text-gray-500 mb-6">Start your journey of self-discovery</p>
            <Link
              to={createPageUrl('Inventory')}
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#7667E5] to-[#A48FFF] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Start First Inventory
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <InventoryCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}