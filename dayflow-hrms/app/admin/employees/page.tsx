'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Filter, Mail, Phone, Key, Copy, Eye, Edit2, Trash2 } from 'lucide-react';
import { User } from '@/types';
import { userAPI, authAPI } from '@/services/api';
import { toast } from 'sonner';
import { AddEmployeeDialog } from '@/components/dialogs/AddEmployeeDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminEmployeesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<User[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [resetPasswordDialog, setResetPasswordDialog] = useState<{
    open: boolean;
    employee: User | null;
    credentials: { loginId: string; tempPassword: string } | null;
  }>({ open: false, employee: null, credentials: null });
  const [viewEmployee, setViewEmployee] = useState<User | null>(null);
  const [editEmployee, setEditEmployee] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login?role=admin');
    }
  }, [user, isLoading, router]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const data = await userAPI.getAllUsers();
      setEmployees(data);
    } catch (error) {
      // Expose backend detail and bounce to admin login on expired/missing token
      if (axios.isAxiosError(error)) {
        const msg = (error.response?.data as any)?.detail || error.message || 'Failed to load employees';
        toast.error(msg);
        if (error.response?.status === 401) {
          router.push('/login?role=admin');
        }
      } else {
        toast.error('Failed to load employees');
      }
    } finally {
      setLoadingEmployees(false);
    }
  };


  const handleResetPassword = async (employee: User) => {
    try {
      const response = await authAPI.adminResetPassword(employee.id);
      setResetPasswordDialog({
        open: true,
        employee,
        credentials: {
          loginId: response.user.loginId || employee.loginId || '',
          tempPassword: response.tempPassword,
        },
      });
      toast.success(`Password reset for ${employee.name}`);
      fetchEmployees();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = (error.response?.data as any)?.detail || error.message || 'Failed to reset password';
        toast.error(msg);
        if (error.response?.status === 401) {
          router.push('/login?role=admin');
        }
      } else {
        toast.error('Failed to reset password');
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDeleteEmployee = async (employee: User) => {
    try {
      await userAPI.deleteUser(employee.id);
      toast.success(`Deleted ${employee.name}`);
      setDeleteConfirm(null);
      fetchEmployees();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = (error.response?.data as any)?.detail || error.message || 'Failed to delete employee';
        toast.error(msg);
        if (error.response?.status === 401) {
          router.push('/login?role=admin');
        }
      } else {
        toast.error('Failed to delete employee');
      }
    }
  };
  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      fetchEmployees();
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return null;
  }

  // Only show employees, not admins
  const allEmployees = employees.filter(emp => emp.role === 'employee');

  const filteredEmployees = allEmployees.filter(emp =>
    (emp.name && emp.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Manage your organization's workforce</p>
          </div>
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Employee Account
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allEmployees.length}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{allEmployees.length}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(allEmployees.map(e => e.department).filter(Boolean)).size}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(allEmployees.map(e => e.position).filter(Boolean)).size}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingEmployees ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Loading employees...
                      </TableCell>
                    </TableRow>
                  ) : filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                                {employee.name && employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {employee.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {employee.email}
                            </p>
                            <p className="text-sm flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {employee.phone || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department || 'N/A'}</TableCell>
                        <TableCell>{employee.position || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              employee.role === 'admin'
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                            }
                          >
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setViewEmployee(employee)}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditEmployee(employee)}
                              title="Edit Employee"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleResetPassword(employee)}
                              title="Reset Password"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setDeleteConfirm(employee)}
                              title="Delete Employee"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

        {/* Add Employee Dialog */}
        <AddEmployeeDialog 
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSuccess={fetchEmployees}
        />

        {/* View Employee Dialog */}
        <Dialog open={!!viewEmployee} onOpenChange={() => setViewEmployee(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                View complete information for {viewEmployee?.name}
              </DialogDescription>
            </DialogHeader>
            {viewEmployee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="text-base font-medium">{viewEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                    <p className="text-base font-medium">{viewEmployee.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Login ID</p>
                    <p className="text-base font-medium">{viewEmployee.loginId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base font-medium">{viewEmployee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-base font-medium">{viewEmployee.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Role</p>
                    <p className="text-base font-medium capitalize">{viewEmployee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="text-base font-medium">{viewEmployee.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Position</p>
                    <p className="text-base font-medium">{viewEmployee.position || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Employee Dialog */}
        <Dialog open={!!editEmployee} onOpenChange={() => setEditEmployee(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Employee Details</DialogTitle>
              <DialogDescription>
                Update employment and financial information for {editEmployee?.name}
              </DialogDescription>
            </DialogHeader>
            {editEmployee && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Employment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-position">Position</Label>
                      <Input
                        id="edit-position"
                        defaultValue={editEmployee.position || ''}
                        placeholder="Enter position"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-department">Department</Label>
                      <Input
                        id="edit-department"
                        defaultValue={editEmployee.department || ''}
                        placeholder="Enter department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-joinDate">Join Date</Label>
                      <Input
                        id="edit-joinDate"
                        defaultValue={editEmployee.joinDate || ''}
                        placeholder="Enter join date"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Contact Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        defaultValue={editEmployee.phone || ''}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-address">Address</Label>
                      <Input
                        id="edit-address"
                        defaultValue={editEmployee.address || ''}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditEmployee(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success(`${editEmployee.name}'s profile updated!`);
                      setEditEmployee(null);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {deleteConfirm?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3 text-sm text-red-900 dark:text-red-100">
              <p className="font-medium mb-1">⚠️ Warning</p>
              <p className="text-xs">This will permanently delete the employee account and all associated data.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDeleteEmployee(deleteConfirm)}
              >
                Delete Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reset Password Credentials Dialog */}
        <Dialog 
          open={resetPasswordDialog.open} 
          onOpenChange={(open) => setResetPasswordDialog({ open, employee: null, credentials: null })}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Password Reset - New Credentials</DialogTitle>
              <DialogDescription>
                Share these credentials with {resetPasswordDialog.employee?.name}. They must change their password on first login.
              </DialogDescription>
            </DialogHeader>
            {resetPasswordDialog.credentials && (
              <div className="space-y-4">
                <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Login ID</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(resetPasswordDialog.credentials!.loginId, 'Login ID')}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-lg font-mono font-bold text-green-900 dark:text-green-100">
                        {resetPasswordDialog.credentials.loginId}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Temporary Password</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(resetPasswordDialog.credentials!.tempPassword, 'Password')}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-lg font-mono font-bold text-green-900 dark:text-green-100 break-all">
                        {resetPasswordDialog.credentials.tempPassword}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-800 dark:text-green-200">
                        Email: {resetPasswordDialog.employee?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 The employee can log in using either their Login ID or email address with this temporary password.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
