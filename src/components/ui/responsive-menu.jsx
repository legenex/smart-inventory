import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';

/**
 * Responsive menu: renders as a DropdownMenu on desktop,
 * as a bottom-sheet Drawer on mobile.
 *
 * items: [{ label, icon, onClick, className, separator }]
 */
export default function ResponsiveMenu({ trigger, items, title }) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {item.separator ? (
                <DropdownMenuSeparator />
              ) : (
                <DropdownMenuItem onClick={item.onClick} className={item.className}>
                  {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                  {item.label}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {title && (
          <p className="text-center text-sm font-medium text-muted-foreground mt-4 mb-2">
            {title}
          </p>
        )}
        <div
          className="px-4 py-4 space-y-1"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              {item.separator ? (
                <div className="h-px bg-border my-2" />
              ) : (
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-control text-sm font-medium min-h-[48px] transition-colors hover:bg-accent ${item.className || ''}`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}