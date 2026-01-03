'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { PayrollChart } from '@/components/charts/PayrollChart';
import { StatCard } from '@/components/ui/stat-card';
import { userAPI } from '@/services/api';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Users, FileText } from 'lucide-react';
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

export default function AdminPayrollPage() {
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
        toast.error('Failed to load payroll data');
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

  // Generate mock payroll records for employees
  const mockPayrollRecords = employees.map((emp, idx) => ({
    id: emp.id?.toString() || idx.toString(),
    name: emp.name,
    employeeId: emp.employeeId,
    basicSalary: 4500 + idx * 300,
    allowances: 800 + idx * 50,
    deductions: 450 + idx * 20,
    netSalary: 4850 + idx * 300,
    status: ['paid', 'processing', 'pending'][idx % 3],
  }));

  const totalPayroll = mockPayrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const avgSalary = (totalPayroll / mockPayrollRecords.length).toFixed(0);
  const paidCount = mockPayrollRecords.filter(r => r.status === 'paid').length;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee salaries and compensation</p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <StatCard
              title="Monthly Payroll"
              value={`₹${totalPayroll.toLocaleString()}`}
              icon={DollarSign}
              trend={{ value: '+5%', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <StatCard
              title="Total Employees"
              value={mockPayrollRecords.length.toString()}
              icon={Users}
              trend={{ value: '+2 this month', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <StatCard
              title="Average Salary"
              value={`₹${avgSalary}`}
              icon={FileText}
              trend={{ value: '+₹500 vs last', isPositive: true }}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <StatCard
              title="Processed"
              value={`${paidCount}/${mockPayrollRecords.length}`}
              icon={TrendingUp}
              trend={{ value: '+1 processed', isPositive: true }}
            />
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <PayrollChart data={mockPayrollData} />
        </motion.div>

        {/* Payroll Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Current Month Payroll</CardTitle>
              <CardDescription>December 2025 - Employee compensation details</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayrollRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.name}</p>
                          <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>₹{record.basicSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-emerald-600">+₹{record.allowances.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">-₹{record.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-bold">₹{record.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : record.status === 'processing'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                          }`}
                        >
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

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-l-4 border-l-violet-500">
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Basic Salary</p>
                  <p className="text-2xl font-bold">
                    ₹{mockPayrollRecords.reduce((sum, r) => sum + r.basicSalary, 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Allowances</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    +₹{mockPayrollRecords.reduce((sum, r) => sum + r.allowances, 0).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Deductions</p>
                  <p className="text-2xl font-bold text-red-600">
                    -₹{mockPayrollRecords.reduce((sum, r) => sum + r.deductions, 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Net Payroll</p>
                  <p className="text-3xl font-bold text-violet-600">₹{totalPayroll.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
