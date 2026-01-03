'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { PayrollChart } from '@/components/charts/PayrollChart';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { userAPI, leaveAPI, attendanceAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  UserPlus,
  FileText,
  Download,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockPayrollData = [
  { month: 'Jul', amount: 450000 },
  { month: 'Aug', amount: 465000 },
  { month: 'Sep', amount: 470000 },
  { month: 'Oct', amount: 475000 },
  { month: 'Nov', amount: 478000 },
  { month: 'Dec', amount: 482000 },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [weeklyAttendanceData, setWeeklyAttendanceData] = useState<Array<{
    date: string;
    present: number;
    absent: number;
    leave: number;
  }>>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [usersData, leavesData, attendanceData] = await Promise.all([
          userAPI.getAllUsers(),
          leaveAPI.getPendingLeaves(),
          attendanceAPI.getAttendance()
        ]);
        setEmployees(usersData.filter(e => e.role === 'employee'));
        setLeaveRequests(leavesData);

        // Process attendance data for chart (last 5 days)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = [];
        
        for (let i = 4; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayName = daysOfWeek[date.getDay()];
          
          const dayRecords = attendanceData.filter(record => record.date === dateStr);
          const presentCount = dayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
          const absentCount = dayRecords.filter(r => r.status === 'absent').length;
          const leaveCount = dayRecords.filter(r => r.status === 'leave').length;
          
          weekData.push({
            date: dayName,
            present: presentCount,
            absent: absentCount,
            leave: leaveCount
          });
        }
        
        setWeeklyAttendanceData(weekData);
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };

    if (!isLoading && user && user.role === 'admin') {
      fetchData();
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return null;
  }

  const handleApprove = async (leaveId: string) => {
    try {
      await leaveAPI.approveLeave(leaveId);
      toast.success('Leave request approved');
      // Refresh leave requests
      const leavesData = await leaveAPI.getPendingLeaves();
      setLeaveRequests(leavesData);
    } catch (error) {
      toast.error('Failed to approve leave request');
      console.error(error);
    }
  };

  const handleReject = async (leaveId: string) => {
    try {
      await leaveAPI.rejectLeave(leaveId);
      toast.success('Leave request rejected');
      // Refresh leave requests
      const leavesData = await leaveAPI.getPendingLeaves();
      setLeaveRequests(leavesData);
    } catch (error) {
      toast.error('Failed to reject leave request');
      console.error(error);
    }
  };

  const statsCards = [
    { title: 'Total Employees', value: employees.length.toString(), icon: Users, trend: { value: '+12%', isPositive: true } },
    { title: 'Present Today', value: Math.round(employees.length * 0.94).toString(), icon: Clock, trend: { value: '94.3%', isPositive: true } },
    { title: 'Pending Leaves', value: leaveRequests.length.toString(), icon: Calendar, trend: { value: '-2', isPositive: true } },
    { title: 'Monthly Payroll', value: `₹${(employees.length * 5000).toLocaleString()}`, icon: DollarSign, trend: { value: '+5%', isPositive: true } },
  ];

  const leaveRequestsWithUser = leaveRequests.map((req) => {
    const user = employees.find(e => e.id === req.user_id?.toString() || e.id === req.userId?.toString());
    return {
      id: req.id?.toString() || '',
      name: user?.name || 'Unknown',
      type: req.leave_type || req.leaveType || 'Leave',
      startDate: req.start_date || req.startDate,
      endDate: req.end_date || req.endDate,
      status: req.status,
    };
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 p-6">
        {/* Page Header */}
        <PageHeader
          title="Admin Dashboard"
          description="Monitor and manage your organization's workforce"
          userName={user.name}
        />

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <AttendanceChart data={weeklyAttendanceData} type="bar" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <PayrollChart data={mockPayrollData} />
          </motion.div>
        </div>

        {/* Pending Leave Requests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Pending Leave Requests
              </CardTitle>
              <CardDescription>Requests requiring your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequestsWithUser.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No pending leave requests
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaveRequestsWithUser.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{formatDate(request.startDate)}-{formatDate(request.endDate)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline"
                            >
                              Reject
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
