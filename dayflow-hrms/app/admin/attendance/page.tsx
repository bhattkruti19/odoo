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
import { attendanceAPI } from '@/services/api';
import { toast } from 'sonner';
import { Clock, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { AttendanceRecord } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminAttendancePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
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
        const today = new Date().toISOString().split('T')[0];
        const data = await attendanceAPI.getAttendance();
        
        // Filter for today's records
        const todayRecords = data.filter(record => record.date === today);
        setAttendanceRecords(todayRecords);

        // Get last 5 weekdays for chart
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = [];
        
        for (let i = 4; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayName = daysOfWeek[date.getDay()];
          
          const dayRecords = data.filter(record => record.date === dateStr);
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

  // Calculate working hours
  const calculateHours = (checkIn: string | null, checkOut: string | null): number => {
    if (!checkIn || !checkOut) return 0;
    try {
      const checkInTime = new Date(`1970-01-01T${checkIn}`);
      const checkOutTime = new Date(`1970-01-01T${checkOut}`);
      const diff = checkOutTime.getTime() - checkInTime.getTime();
      return diff / (1000 * 60 * 60); // Convert to hours
    } catch {
      return 0;
    }
  };

  const presentCount = attendanceRecords.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendanceRecords.filter(a => a.status === 'absent').length;
  const leaveCount = attendanceRecords.filter(a => a.status === 'leave').length;
  const totalEmployees = attendanceRecords.length;
  const attendanceRate = totalEmployees > 0 ? ((presentCount / totalEmployees) * 100).toFixed(1) : '0';

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
          <AttendanceChart data={weeklyAttendanceData} type="bar" />
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
                      {attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.userName}</p>
                              <p className="text-xs text-muted-foreground">{record.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>
                            {record.checkIn && record.checkOut 
                              ? `${calculateHours(record.checkIn, record.checkOut).toFixed(2)}h` 
                              : '-'}
                          </TableCell>
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
                      {attendanceRecords.filter(r => r.status === 'present' || r.status === 'late').map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.userName}</p>
                              <p className="text-xs text-muted-foreground">{record.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>
                            {record.checkIn && record.checkOut 
                              ? `${calculateHours(record.checkIn, record.checkOut).toFixed(2)}h` 
                              : '-'}
                          </TableCell>
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
                      {attendanceRecords.filter(r => r.status === 'absent').map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.userName}</p>
                              <p className="text-xs text-muted-foreground">{record.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>
                            {record.checkIn && record.checkOut 
                              ? `${calculateHours(record.checkIn, record.checkOut).toFixed(2)}h` 
                              : '-'}
                          </TableCell>
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
                      {attendanceRecords.filter(r => r.status === 'leave').map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.userName}</p>
                              <p className="text-xs text-muted-foreground">{record.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>
                            {record.checkIn && record.checkOut 
                              ? `${calculateHours(record.checkIn, record.checkOut).toFixed(2)}h` 
                              : '-'}
                          </TableCell>
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
