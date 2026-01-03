'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  BarChart3,
  UserCircle,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'employee';
}

const adminLinks = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: Clock },
  { href: '/admin/leave', label: 'Leave Requests', icon: Calendar },
  { href: '/admin/payroll', label: 'Payroll', icon: DollarSign },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
];

const employeeLinks = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/employee/profile', label: 'Profile', icon: UserCircle },
  { href: '/employee/attendance', label: 'Attendance', icon: Clock },
  { href: '/employee/leave', label: 'Leave', icon: Calendar },
  { href: '/employee/payroll', label: 'Payroll', icon: DollarSign },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'admin' ? adminLinks : employeeLinks;

  return (
    <aside className="hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-card">
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid gap-1 px-4">
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent',
                    isActive
                      ? role === 'admin'
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto h-2 w-2 rounded-full bg-white"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div
          className={cn(
            'rounded-lg p-3',
            role === 'admin'
              ? 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950'
          )}
        >
          <p className="text-xs font-medium text-muted-foreground mb-1">Role</p>
          <p className="text-sm font-semibold capitalize">{role}</p>
        </div>
      </div>
    </aside>
  );
}
