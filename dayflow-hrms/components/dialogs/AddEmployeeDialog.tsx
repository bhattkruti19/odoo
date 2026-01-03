'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, Copy } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';

const addEmployeeSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'employee']),
  date_of_joining: z.string().min(1, 'Date of joining is required'),
  department: z.string().optional(),
  position: z.string().optional(),
});

type AddEmployeeFormData = z.infer<typeof addEmployeeSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddEmployeeDialog({ open, onOpenChange, onSuccess }: AddEmployeeDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState<{ loginId: string; tempPassword: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
  } = useForm<AddEmployeeFormData>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      role: 'employee',
      department: '',
      position: '',
    },
  });

  const selectedRole = watch('role');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleClose = () => {
    setGenerated(null);
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: AddEmployeeFormData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.adminCreateUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        date_of_joining: data.date_of_joining,
        department: data.department,
        position: data.position,
      });

      setGenerated({
        loginId: response.user.loginId || '',
        tempPassword: response.tempPassword,
      });

      toast.success(`Created user ${response.user.name}`);
      onSuccess();
      // Don't reset or close - show credentials
    } catch (error: any) {
      // Show backend detail and bounce to admin login on unauthorized
      if (axios.isAxiosError(error)) {
        const errorMsg = (error.response?.data as any)?.detail || error.message || 'Failed to create employee account';
        toast.error(errorMsg);
        if (error.response?.status === 401) {
          router.push('/login?role=admin');
        }
      } else {
        toast.error('Failed to create employee account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Employee Account</DialogTitle>
          <DialogDescription className="text-xs">
            Generates login credentials automatically.
          </DialogDescription>
        </DialogHeader>

        {!generated ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* First Name */}
          <div className="space-y-1">
            <Label htmlFor="first_name" className="text-sm">First Name *</Label>
            <Input
              id="first_name"
              {...register('first_name')}
              className={errors.first_name ? 'border-red-500' : ''}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <Label htmlFor="last_name" className="text-sm">Last Name *</Label>
            <Input
              id="last_name"
              {...register('last_name')}
              className={errors.last_name ? 'border-red-500' : ''}
            />
            {errors.last_name && (
              <p className="text-sm text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          {/* Work Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm">Work Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="employee@company.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Date of Joining */}
          <div className="space-y-1">
            <Label htmlFor="date_of_joining" className="text-sm">Date of Joining *</Label>
            <Input
              id="date_of_joining"
              type="date"
              {...register('date_of_joining')}
              className={errors.date_of_joining ? 'border-red-500' : ''}
            />
            {errors.date_of_joining && (
              <p className="text-xs text-red-500">{errors.date_of_joining.message}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1">
            <Label htmlFor="department" className="text-sm">Department</Label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Position */}
          <div className="space-y-1">
            <Label htmlFor="position" className="text-sm">Position</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Senior Manager">Senior Manager</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                    <SelectItem value="C-Level">C-Level</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <Label htmlFor="role" className="text-sm">Role *</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Master List'
              )}
            </Button>
          </DialogFooter>
        </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
              <div className="flex items-center gap-2 font-semibold text-green-900 dark:text-green-100 mb-3">
                <ShieldCheck className="h-5 w-5" /> Employee Created Successfully
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Login ID</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generated.loginId, 'Login ID')}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-lg font-mono font-bold text-green-900 dark:text-green-100">
                    {generated.loginId}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Temporary Password</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generated.tempPassword, 'Password')}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-lg font-mono font-bold text-green-900 dark:text-green-100 break-all">
                    {generated.tempPassword}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-green-800 dark:text-green-200">
                💡 Share these credentials with the employee. They must change the password on first login.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleClose}
                className="w-full"
              >
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
