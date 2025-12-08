import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function InventoryCard({ entry, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link 
        to={createPageUrl(`HistoryDetail?id=${entry.id}`)}
        className="block bg-white rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#7667E5]/10 to-[#A48FFF]/10 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#7667E5]" />
            </div>
            <div>
              <p className="font-semibold text-[#1F2C46]">
                {format(new Date(entry.date), 'EEEE, MMMM d')}
              </p>
              <p className="text-sm text-gray-500 capitalize">
                {entry.inventory_type === 'aa' ? 'Recovery Inventory' : 'Daily Reflection'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7667E5] transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}