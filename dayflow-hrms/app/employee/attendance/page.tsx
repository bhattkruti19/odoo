'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { attendanceAPI } from '@/services/api';

export default function EmployeeAttendancePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) {
      router.push('/login?role=employee');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoadingRecords(true);
        const records = await attendanceAPI.getMyRecords();
        setAttendanceRecords(records);
        
        // Check if already checked in today
        const today = new Date().toISOString().split('T')[0];
        const todayRecord: any = records.find((r: any) => r.date === today);
        if (todayRecord && todayRecord.check_in) {
          setIsCheckedIn(!todayRecord.check_out);
          if (todayRecord.check_in) {
            const checkInDate = new Date(todayRecord.check_in);
            setCheckInTime(checkInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
      } finally {
        setLoadingRecords(false);
      }
    };

    if (!isLoading && user) {
      fetchRecords();
    }
  }, [isLoading, user]);

  const handleCheckIn = async () => {
    try {
      const response = await attendanceAPI.checkIn();
      const checkInDate = new Date(response.check_in);
      const formattedTime = checkInDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTime(formattedTime);
      toast.success(`Checked in at ${formattedTime}`);
      
      // Refresh records
      const records = await attendanceAPI.getMyRecords();
      setAttendanceRecords(records);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Failed to check in';
      toast.error(errorMsg);
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await attendanceAPI.checkOut();
      setIsCheckedIn(false);
      toast.success('Checked out successfully');
      
      // Refresh records
      const records = await attendanceAPI.getMyRecords();
      setAttendanceRecords(records);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Failed to check out';
      toast.error(errorMsg);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track your daily attendance</p>
        </motion.div>

        {/* Check In/Out Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Attendance
              </CardTitle>
              <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={isCheckedIn ? 'default' : 'secondary'} className={isCheckedIn ? 'bg-emerald-500' : ''}>
                    {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                  </Badge>
                </div>
                {isCheckedIn && checkInTime && (
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">Checked in at</p>
                    <p className="text-xl font-bold text-emerald-600">{checkInTime}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {!isCheckedIn ? (
                  <Button
                    onClick={handleCheckIn}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                ) : (
                  <Button
                    onClick={handleCheckOut}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Check Out
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Attendance Records */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Your attendance history</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="recent" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingRecords ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            Loading attendance records...
                          </TableCell>
                        </TableRow>
                      ) : attendanceRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        attendanceRecords.map((record: any) => {
                          let hours = 0;
                          if (record.check_in && record.check_out) {
                            const checkIn = new Date(record.check_in);
                            const checkOut = new Date(record.check_out);
                            hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
                          }
                          return (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </TableCell>
                              <TableCell>
                                {record.check_in
                                  ? new Date(record.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                  : '-'}
                              </TableCell>
                              <TableCell>
                                {record.check_out
                                  ? new Date(record.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                  : '-'}
                              </TableCell>
                              <TableCell>{hours > 0 ? `${hours.toFixed(2)}h` : '-'}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={
                                    record.status === 'present'
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                      : record.status === 'late'
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                      : record.status === 'absent'
                                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="monthly">
                  <div className="text-center py-8 text-muted-foreground">
                    Monthly view coming soon...
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
