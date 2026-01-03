'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { leaveAPI } from '@/services/api';
import { StatCard } from '@/components/ui/stat-card';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LeaveRequest } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminLeavePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null);
  const [comment, setComment] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const calculateDays = (startDate: string | undefined, endDate: string | undefined): number => {
    try {
      if (!startDate || !endDate) return 0;
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, isLoading, router]);
const fetchLeaveRequests = async () => {
    try {
      setLoadingData(true);
      const data = await leaveAPI.getAllLeaves();
      setLeaveRequests(data);
    } catch (error) {
      toast.error('Failed to load leave data');
      console.error(error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      fetchLeaveRequests();
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return null;
  }

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await leaveAPI.approveLeave(selectedRequest.id, comment);
      toast.success(`Leave request approved for ${selectedRequest.userName}`);
      setSelectedRequest(null);
      setComment('');
      await fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      toast.error('Failed to approve leave request');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    try {
      await leaveAPI.rejectLeave(selectedRequest.id, comment);
      toast.error(`Leave request rejected for ${selectedRequest.userName}`);
      setSelectedRequest(null);
      setComment('');
      await fetchLeaveRequests(); // Refresh the list
    } catch (error) {
      toast.error('Failed to reject leave request');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved');
  const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected');

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">Review and manage employee leave requests</p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <StatCard
              title="Pending"
              value={pendingRequests.length.toString()}
              icon={Clock}
              trend={{ value: 'Awaiting decision', isPositive: false }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <StatCard
              title="Approved"
              value={approvedRequests.length.toString()}
              icon={CheckCircle}
              trend={{ value: '+2 this month', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <StatCard
              title="Rejected"
              value={rejectedRequests.length.toString()}
              icon={XCircle}
              trend={{ value: 'Review requested', isPositive: false }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <StatCard
              title="Total Requests"
              value={leaveRequests.length.toString()}
              icon={Calendar}
              trend={{ value: '+1 pending', isPositive: false }}
            />
          </motion.div>
        </div>

        {/* Requests Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Manage employee leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList>
                  <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.userName}</p>
                              <p className="text-xs text-muted-foreground">{request.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{request.leaveType}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(request.appliedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Review Leave Request</DialogTitle>
                                  <DialogDescription>
                                    {request.userName} - <span className="capitalize">{request.leaveType}</span> Leave
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">Duration</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()} 
                                      ({String(calculateDays(request.startDate, request.endDate))} days)
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Reason</p>
                                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-2">Comment (Optional)</p>
                                    <Textarea
                                      placeholder="Add a comment..."
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={handleReject}
                                    disabled={isProcessing}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    {isProcessing ? 'Processing...' : 'Reject'}
                                  </Button>
                                  <Button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-600"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isProcessing ? 'Processing...' : 'Approve'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.userName}</TableCell>
                          <TableCell className="capitalize">{request.leaveType}</TableCell>
                          <TableCell>
                            {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            {String(calculateDays(request.startDate, request.endDate))}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                              Approved
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.userName}</TableCell>
                          <TableCell className="capitalize">{request.leaveType}</TableCell>
                          <TableCell>
                            {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </TableCell>
                          <TableCell>
                            {String(calculateDays(request.startDate, request.endDate))}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                              Rejected
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{request.userName}</p>
                              <p className="text-xs text-muted-foreground">{request.userId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{request.leaveType}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </TableCell>
                          <TableCell>
                            {String(calculateDays(request.startDate, request.endDate))}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                Pending
                              </Badge>
                            )}
                            {request.status === 'approved' && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                Approved
                              </Badge>
                            )}
                            {request.status === 'rejected' && (
                              <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                Rejected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(request.appliedDate).toLocaleDateString()}
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
