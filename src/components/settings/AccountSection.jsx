import React, { useState } from 'react';
import { LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const cardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--line)',
};

export default function AccountSection() {
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.functions.invoke('deleteAccount', {});
      base44.auth.logout();
    } catch (err) {
      console.error('Failed to delete account', err);
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Sign Out */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="text-lg font-semibold text-foreground mb-2">Sign Out</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You'll need to log back in to access your account
        </p>
        <Button
          variant="destructive"
          onClick={() => base44.auth.logout()}
          className="w-full rounded-xl min-h-[44px]"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Delete Account */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Delete Account
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full rounded-xl min-h-[44px]">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all your data, including inventory entries, journal entries, gratitude lists, question settings, and subscription history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? 'Deleting...' : 'Delete Forever'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}