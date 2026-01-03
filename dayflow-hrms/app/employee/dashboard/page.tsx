'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import {
  Clock,
  Calendar,
  DollarSign,
  UserCircle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  LogIn,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    href: '/employee/profile',
    title: 'Profile',
    description: 'View and edit your profile',
    icon: UserCircle,
    color: 'from-purple-500 to-pink-500',
  },
  {
    href: '/employee/attendance',
    title: 'Attendance',
    description: 'Check in/out and view records',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/employee/leave',
    title: 'Leave',
    description: 'Apply for leave',
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    href: '/employee/payroll',
    title: 'Payroll',
    description: 'View salary details',
    icon: DollarSign,
    color: 'from-orange-500 to-amber-500',
  },
];

const mockAttendanceData = [
  { date: 'Mon', present: 1, absent: 0, leave: 0 },
  { date: 'Tue', present: 1, absent: 0, leave: 0 },
  { date: 'Wed', present: 1, absent: 0, leave: 0 },
  { date: 'Thu', present: 1, absent: 0, leave: 0 },
  { date: 'Fri', present: 0, absent: 0, leave: 1 },
  { date: 'Sat', present: 0, absent: 0, leave: 0 },
  { date: 'Sun', present: 0, absent: 0, leave: 0 },
];

const mockActivityLogs = [
  {
    id: '1',
    action: 'Checked in',
    time: '9:00 AM',
    type: 'attendance' as const,
    status: 'success',
  },
  {
    id: '2',
    action: 'Leave approved',
    time: 'Yesterday',
    type: 'leave' as const,
    status: 'success',
  },
  {
    id: '3',
    action: 'Payroll processed',
    time: '2 days ago',
    type: 'payroll' as const,
    status: 'info',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function EmployeeDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) {
      router.push('/login?role=employee');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <DashboardLayout role="employee">
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your work today
          </p>
        </motion.div>

        {/* Today's Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Today's Status</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  Present
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Checked in at 9:00 AM
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.href} variants={itemVariants}>
                <Link href={action.href}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 hover:border-border">
                    <CardHeader className="pb-3">
                      <div
                        className={`h-12 w-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{action.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Attendance Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AttendanceChart data={mockAttendanceData} type="bar" />
            </motion.div>
          </div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockActivityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        log.status === 'success'
                          ? 'bg-emerald-100 dark:bg-emerald-900'
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}
                    >
                      {log.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-3"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">95%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leaves Taken</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3 / 20</div>
                <p className="text-xs text-muted-foreground">Days used</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Working Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">160</div>
                <p className="text-xs text-muted-foreground">Hours this month</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
