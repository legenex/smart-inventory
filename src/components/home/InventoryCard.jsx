import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronRight, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import useTheme from '@/components/theme/useTheme';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function InventoryCard({ entry, index, onDelete }) {
  const { colors } = useTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await base44.entities.InventoryEntry.delete(entry.id);
      if (onDelete) onDelete(entry.id);
    } catch (err) {
      console.error(err);
    }
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ delay: prefersReducedMotion ? 0 : index * 0.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      >
        <Link
          to={createPageUrl(`HistoryDetail?id=${entry.id}`)}
          className="block bg-card rounded-card p-5 shadow-soft border border-border transition-shadow hover:shadow-md group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}12` }}
              >
                <Calendar className="w-4 h-4" style={{ color: colors.primary }} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground">
                  {format(new Date(entry.date), 'EEEE, MMMM d')}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {entry.inventory_type === 'aa' ? 'Recovery Inventory' : 'Daily Reflection'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="p-2 hover:bg-muted rounded-control transition-colors"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inventory from{' '}
              {format(new Date(entry.date), 'MMMM d, yyyy')}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}