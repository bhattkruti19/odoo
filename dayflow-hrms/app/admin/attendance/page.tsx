'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { StatCard } from '@/components/ui/stat-card';
import { userAPI } from '@/services/api';
import { toast } from 'sonner';
import { Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockAttendanceData = [
  { date: 'Mon', present: 231, absent: 8, leave: 6 },
  { date: 'Tue', present: 235, absent: 5, leave: 5 },
  { date: 'Wed', present: 230, absent: 10, leave: 5 },
  { date: 'Thu', present: 238, absent: 4, leave: 3 },
  { date: 'Fri', present: 231, absent: 8, leave: 6 },
];

export default function AdminAttendancePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
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
        const data = await userAPI.getAllUsers();
        setEmployees(data.filter(e => e.role === 'employee'));
      } catch (error) {
        toast.error('Failed to load attendance data');
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

  // Generate mock attendance for employees
  const mockTodayAttendance = employees.map((emp, idx) => ({
    id: emp.id?.toString() || idx.toString(),
    name: emp.name,
    employeeId: emp.employeeId,
    checkIn: idx % 5 === 0 ? null : `${8 + (idx % 2)}:${15 + (idx % 4)}0 AM`,
    checkOut: idx % 3 === 0 ? null : `06:${Math.random() > 0.5 ? '00' : '10'} PM`,
    status: idx % 5 === 0 ? 'absent' : idx % 4 === 0 ? 'leave' : idx % 3 === 0 ? 'late' : 'present',
    hours: idx % 5 === 0 ? 0 : 8 + Math.random() * 1.5,
  }));

  const presentCount = mockTodayAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentCount = mockTodayAttendance.filter(a => a.status === 'absent').length;
  const leaveCount = mockTodayAttendance.filter(a => a.status === 'leave').length;
  const attendanceRate = ((presentCount / mockTodayAttendance.length) * 100).toFixed(1);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Monitor employee attendance and track patterns</p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <StatCard
              title="Present Today"
              value={presentCount.toString()}
              icon={Users}
              trend={{ value: `${presentCount} employees`, isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <StatCard
              title="Absent"
              value={absentCount.toString()}
              icon={AlertTriangle}
              trend={{ value: `${absentCount} employees`, isPositive: false }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <StatCard
              title="On Leave"
              value={leaveCount.toString()}
              icon={Clock}
              trend={{ value: `${leaveCount} employees`, isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <StatCard
              title="Attendance Rate"
              value={`${attendanceRate}%`}
              icon={TrendingUp}
              trend={{ value: `${attendanceRate}% today`, isPositive: true }}
            />
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AttendanceChart data={mockAttendanceData} type="bar" />
        </motion.div>

        {/* Attendance Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="present">Present</TabsTrigger>
                  <TabsTrigger value="absent">Absent</TabsTrigger>
                  <TabsTrigger value="leave">On Leave</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTodayAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.name}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hours > 0 ? `${record.hours}h` : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                record.status === 'present'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                  : record.status === 'late'
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                  : record.status === 'leave'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="present" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTodayAttendance.filter(r => r.status === 'present' || r.status === 'late').map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.name}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hours > 0 ? `${record.hours.toFixed(1)}h` : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                record.status === 'present'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="absent" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTodayAttendance.filter(r => r.status === 'absent').map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.name}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hours > 0 ? `${record.hours.toFixed(1)}h` : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="leave" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTodayAttendance.filter(r => r.status === 'leave').map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.name}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.hours > 0 ? `${record.hours.toFixed(1)}h` : '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
