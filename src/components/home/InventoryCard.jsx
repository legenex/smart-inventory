import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronRight, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InventoryCard({ entry, index, onDelete }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await base44.entities.InventoryEntry.delete(entry.id);
      if (onDelete) {
        onDelete(entry.id);
      }
    } catch (err) {
      console.error(err);
    }
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ delay: index * 0.1 }}
        className="relative"
      >
        <Link 
          to={createPageUrl(`HistoryDetail?id=${entry.id}`)}
          className="block bg-white rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7667E5]/10 to-[#A48FFF]/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#7667E5]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#1F2C46]">
                  {format(new Date(entry.date), 'EEEE, MMMM d')}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {entry.inventory_type === 'aa' ? 'Recovery Inventory' : 'Daily Reflection'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7667E5] transition-colors" />
            </div>
          </div>
        </Link>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inventory from {format(new Date(entry.date), 'MMMM d, yyyy')}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}