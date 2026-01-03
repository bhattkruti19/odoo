'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { DollarSign, TrendingUp, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockSalaryBreakdown = {
  basicSalary: 5000,
  allowances: 1000,
  deductions: 500,
  netSalary: 5500,
};

const mockPayrollHistory = [
  { id: '1', month: 'December 2025', gross: 6000, deductions: 500, net: 5500, status: 'paid' },
  { id: '2', month: 'November 2025', gross: 6000, deductions: 500, net: 5500, status: 'paid' },
  { id: '3', month: 'October 2025', gross: 6000, deductions: 500, net: 5500, status: 'paid' },
];

export default function EmployeePayrollPage() {
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
                <div className="text-3xl font-bold">₹{mockSalaryBreakdown.basicSalary.toLocaleString()}</div>
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
                <div className="text-3xl font-bold text-blue-600">₹{mockSalaryBreakdown.allowances.toLocaleString()}</div>
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
                <div className="text-3xl font-bold text-violet-600">₹{mockSalaryBreakdown.netSalary.toLocaleString()}</div>
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
                  <p className="text-xl font-bold">₹{mockSalaryBreakdown.basicSalary.toLocaleString()}</p>
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
                  <p className="text-xl font-bold text-blue-600">+₹{mockSalaryBreakdown.allowances.toLocaleString()}</p>
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
                  <p className="text-xl font-bold text-red-600">-₹{mockSalaryBreakdown.deductions.toLocaleString()}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-50 dark:bg-violet-950 rounded-lg border-2 border-violet-500">
                  <div>
                    <p className="font-bold text-lg">Net Salary</p>
                    <p className="text-sm text-muted-foreground">Take-home pay</p>
                  </div>
                  <p className="text-2xl font-bold text-violet-600">₹{mockSalaryBreakdown.netSalary.toLocaleString()}</p>
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
                  {mockPayrollHistory.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.month}</TableCell>
                      <TableCell>₹{record.gross.toLocaleString()}</TableCell>
                      <TableCell>₹{record.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-emerald-600">₹{record.net.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
