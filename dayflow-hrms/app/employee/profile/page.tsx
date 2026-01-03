'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { userAPI } from '@/services/api';
import { toast } from 'sonner';
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Save, User, Building, CreditCard } from 'lucide-react';

export default function EmployeeProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    emergencyContact: user?.emergencyContact || '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        dateOfBirth: user.dateOfBirth || prev.dateOfBirth,
        emergencyContact: user.emergencyContact || prev.emergencyContact,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'employee')) {
      router.push('/login?role=employee');
    }
  }, [user, isLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userAPI.updateCurrentProfile({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
        emergency_contact: formData.emergencyContact,
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          description="Manage your personal and employment information"
          userName={user.name}
          actions={
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              disabled={isSaving}
            >
              {isSaving ? (
                'Saving...'
              ) : isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                'Edit Personal Info'
              )}
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3 px-6 pb-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600" />
              <CardContent className="relative pt-0">
                <div className="flex flex-col items-center -mt-12 mb-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full h-9 w-9 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <h2 className="text-lg font-bold text-center mt-2">{user.name}</h2>
                    <p className="text-sm text-muted-foreground font-medium">{user?.position || 'Employee'}</p>
                    <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                      Active
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-3 font-mono">{user.employeeId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content with Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="personal" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
                  <User className="h-4 w-4" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="employment" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
                  <Building className="h-4 w-4" />
                  Employment
                </TabsTrigger>
                <TabsTrigger value="financial" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
                  <CreditCard className="h-4 w-4" />
                  Financial
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Your basic personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isEditing ? (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="text-base font-semibold">{formData.name || '-'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base font-semibold">{formData.email || '-'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                            <p className="text-base font-semibold">{formData.phone || '-'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <p className="text-base font-semibold">{formData.address || '-'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                            <p className="text-base font-semibold">{formData.dateOfBirth || '-'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                            <p className="text-base font-semibold">{formData.emergencyContact || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              className="border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              className="border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                              className="border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Enter your address"
                              className="border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              placeholder="Enter your date of birth"
                              className="border-slate-200 dark:border-slate-700"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyContact">Emergency Contact</Label>
                            <Input
                              id="emergencyContact"
                              name="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={handleInputChange}
                              placeholder="Enter emergency contact"
                              className="border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Employment Details</CardTitle>
                    <CardDescription>Your work-related information (read-only)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Employee ID</p>
                        <p className="text-base font-semibold">{user?.employeeId || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Position</p>
                        <p className="text-base font-semibold">{user?.position || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Department</p>
                        <p className="text-base font-semibold">{user?.department || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Manager</p>
                        <p className="text-base font-semibold">{user?.manager || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                        <p className="text-base font-semibold">{user?.joinDate || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Employment Type</p>
                        <Badge variant="secondary" className="w-fit">{user?.employmentType || 'N/A'}</Badge>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                        ℹ️ Contact your admin to update employment details.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Financial Information</CardTitle>
                    <CardDescription>Your salary and banking details (read-only)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Base Salary</p>
                        <p className="text-base font-semibold">{user?.baseSalary ? `₹${user.baseSalary}` : '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                        <p className="text-base font-semibold">{user?.bankName || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                        <p className="text-base font-semibold">{user?.accountNumber || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Tax ID</p>
                        <p className="text-base font-semibold">{user?.taxId || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Pay Frequency</p>
                        <p className="text-base font-semibold">{user?.payFrequency || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Next Payday</p>
                        <p className="text-base font-semibold">{user?.nextPayday || '-'}</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                        ℹ️ Financial details are managed by admin only.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
