'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Plus } from 'lucide-react';
import { leaveAPI } from '@/services/api';

const leaveSchema = z.object({
  leaveType: z.enum(['sick', 'casual', 'annual', 'unpaid']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export default function EmployeeLeavePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) {
      router.push('/login?role=employee');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchLeaves = async () => {
      if (!isLoading && user) {
        try {
          setLoadingRequests(true);
          const data = await leaveAPI.getMyLeaves();
          setLeaveRequests(data);
        } catch (error) {
          toast.error('Failed to load leave requests');
          console.error(error);
        } finally {
          setLoadingRequests(false);
        }
      }
    };
    fetchLeaves();
  }, [isLoading, user]);

  const onSubmit = async (data: LeaveFormData) => {
    setIsSubmitting(true);
    try {
      await leaveAPI.createLeave({
        leave_type: data.leaveType,
        start_date: data.startDate,
        end_date: data.endDate,
        reason: data.reason,
      });
      toast.success('Leave request submitted successfully!');
      setIsDialogOpen(false);
      // Refresh leave requests
      const updatedData = await leaveAPI.getMyLeaves();
      setLeaveRequests(updatedData);
    } catch (error) {
      toast.error('Failed to submit leave request');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return null;
  }

  const selectedLeaveType = watch('leaveType');

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
            <p className="text-muted-foreground">Apply for leave and track your requests</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                <Plus className="mr-2 h-4 w-4" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Fill in the details to request leave</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select onValueChange={(value) => setValue('leaveType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="casual">Casual Leave</SelectItem>
                      <SelectItem value="annual">Annual Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.leaveType && <p className="text-xs text-red-500">{errors.leaveType.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" {...register('startDate')} />
                    {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" {...register('endDate')} />
                    {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea {...register('reason')} placeholder="Explain the reason for your leave..." className="min-h-[100px]" />
                  {errors.reason && <p className="text-xs text-red-500">{errors.reason.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Leave Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">20 days</div>
                <p className="text-xs text-muted-foreground mt-1">Annual allocation</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Leave Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">3 days</div>
                <p className="text-xs text-muted-foreground mt-1">This year</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">17 days</div>
                <p className="text-xs text-muted-foreground mt-1">Available</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
              <CardDescription>Your past and pending leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingRequests ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : leaveRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No leave requests found</div>
                ) : (
                  leaveRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{request.leave_type || request.leaveType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.start_date || request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.end_date || request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Applied on {new Date(request.created_at || request.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          request.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
