'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { DollarSign, TrendingUp, FileText } from 'lucide-react';
import { payrollAPI } from '@/services/api';
import { PayrollRecord } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function EmployeePayrollPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) {
      router.push('/login?role=employee');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchPayroll = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingData(true);
        const data = await payrollAPI.getPayroll(user.id);
        // Sort by year and month descending
        data.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year;
          return b.month - a.month;
        });
        setPayrollRecords(data);
      } catch (error) {
        console.error('Failed to load payroll:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (!isLoading && user && user.role === 'employee') {
      fetchPayroll();
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return null;
  }

  // Get current/latest payroll record
  const currentPayroll = payrollRecords.length > 0 ? payrollRecords[0] : null;
  const totalPayroll = payrollRecords.reduce((sum, r) => sum + r.base_salary, 0);
  const avgSalary = payrollRecords.length > 0 ? (totalPayroll / payrollRecords.length).toFixed(0) : '0';

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">View your salary details and payment history</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Basic Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{currentPayroll?.base_salary.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">Per month</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Allowances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">₹{currentPayroll?.allowances.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">Additional benefits</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card className="border-l-4 border-l-violet-500">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-violet-600">₹{currentPayroll?.net_salary.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">After deductions</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Salary Breakdown</CardTitle>
              <CardDescription>Detailed view of your salary components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Basic Salary</p>
                      <p className="text-sm text-muted-foreground">Base pay</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">₹{currentPayroll?.base_salary.toLocaleString() || '0'}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Allowances</p>
                      <p className="text-sm text-muted-foreground">Transport, Housing, etc.</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-blue-600">+₹{currentPayroll?.allowances.toLocaleString() || '0'}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Deductions</p>
                      <p className="text-sm text-muted-foreground">Tax, Insurance</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-red-600">-₹{currentPayroll?.deductions.toLocaleString() || '0'}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50 dark:bg-violet-950 rounded-lg border-2 border-violet-500">
                  <div>
                    <p className="font-bold text-lg">Net Salary</p>
                    <p className="text-sm text-muted-foreground">Take-home pay</p>
                  </div>
                  <p className="text-2xl font-bold text-violet-600">₹{currentPayroll?.net_salary.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your past salary payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => {
                    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const monthName = monthNames[record.month];
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{monthName} {record.year}</TableCell>
                        <TableCell>₹{(record.base_salary + record.allowances + record.bonus).toLocaleString()}</TableCell>
                        <TableCell>₹{(record.deductions + record.tax).toLocaleString()}</TableCell>
                        <TableCell className="font-bold text-emerald-600">₹{record.net_salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                            {record.payment_date ? 'paid' : 'pending'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
