/**
 * AppLayout Component
 * Main application shell containing the sidebar and the active view outlet.
 */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/app/Sidebar';
import { Logo } from '@/components/common/Logo';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-[280px] z-30">
        <Sidebar />
      </div>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-white border-b border-slate-200 z-40 px-4 flex items-center justify-between">
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-9 w-9 p-0"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[280px] max-w-xs h-full bg-white z-10 shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-[280px] pt-16 lg:pt-0 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
