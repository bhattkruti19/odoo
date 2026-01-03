'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { PayrollChart } from '@/components/charts/PayrollChart';
import { Download, FileText, TrendingUp, Users, Clock, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

const mockAttendanceData = [
  { date: 'Week 1', present: 920, absent: 30, leave: 20 },
  { date: 'Week 2', present: 935, absent: 20, leave: 15 },
  { date: 'Week 3', present: 910, absent: 35, leave: 25 },
  { date: 'Week 4', present: 940, absent: 18, leave: 12 },
];

const mockPayrollData = [
  { month: 'Jul', amount: 450000 },
  { month: 'Aug', amount: 465000 },
  { month: 'Sep', amount: 470000 },
  { month: 'Oct', amount: 475000 },
  { month: 'Nov', amount: 478000 },
  { month: 'Dec', amount: 482000 },
];

const reports = [
  {
    title: 'Monthly Attendance Report',
    description: 'Detailed attendance records for the month',
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Payroll Summary Report',
    description: 'Complete payroll breakdown and analysis',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Employee Performance Report',
    description: 'Individual and team performance metrics',
    icon: TrendingUp,
    color: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Leave Balance Report',
    description: 'Employee leave balances and utilization',
    icon: FileText,
    color: 'from-orange-500 to-amber-500',
  },
];

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and export comprehensive reports</p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <StatCard
              title="Total Employees"
              value="245"
              icon={Users}
              trend={{ value: 'Active workforce', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <StatCard
              title="Avg Attendance"
              value="94.8%"
              icon={TrendingUp}
              trend={{ value: 'This month', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <StatCard
              title="Leave Utilization"
              value="67%"
              icon={Clock}
              trend={{ value: 'Of allocated', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <StatCard
              title="Total Payroll"
              value="₹482K"
              icon={DollarSign}
              trend={{ value: 'Monthly expense', isPositive: true }}
            />
          </motion.div>
        </div>

        {/* Available Reports */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Generate and download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {reports.map((report, index) => {
                  const Icon = report.icon;
                  return (
                    <motion.div
                      key={report.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <AttendanceChart data={mockAttendanceData} type="line" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <PayrollChart data={mockPayrollData} />
          </motion.div>
        </div>

        {/* Custom Report Builder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Custom Report Builder
              </CardTitle>
              <CardDescription>Create customized reports based on your specific requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Build custom reports with flexible date ranges, filters, and export options
                </p>
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700">
                  <FileText className="mr-2 h-4 w-4" />
                  Build Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
