import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { onApplicationsChange } from '@/services/applicationService';
import { onContactsChange } from '@/services/contactService';
import { Users, FileText, MessageSquare, TrendingUp, Loader2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ApplicationDetailModal from '@/components/admin/ApplicationDetailModal';
import ContactDetailModal from '@/components/admin/ContactDetailModal';

const COLORS = ['hsl(217 91% 45%)', 'hsl(180 65% 50%)', 'hsl(38 92% 55%)', 'hsl(142 76% 36%)', 'hsl(0 84% 60%)'];
  
const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

 // Uses onSnapshot - REAL-TIME updates
useEffect(() => {
  if (!isAdmin) return;
  
  setDataLoading(true);
  let isFirstLoad = true;
  
  // Real-time listener for applications
  const unsubscribeApps = onApplicationsChange((apps) => {
    setApplications(apps);
    if (isFirstLoad) {
      setDataLoading(false);
      isFirstLoad = false;
    }
  });
  
  // Real-time listener for contacts
  const unsubscribeContacts = onContactsChange((contacts) => {
    setContacts(contacts);
  });
  
  // Cleanup listeners when component unmounts
  return () => {
    unsubscribeApps();
    unsubscribeContacts();
  };
}, [isAdmin]);


  const handleViewApplication = (app: any) => {
    setSelectedApplication(app);
    setAppModalOpen(true);
  };

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setContactModalOpen(true);
  };

  const handleAppModalClose = (open: boolean) => {
    setAppModalOpen(open);
    if (!open) {
      setSelectedApplication(null);
      loadData(); // Refresh data when modal closes
    }
  };

  const handleContactModalClose = (open: boolean) => {
    setContactModalOpen(open);
    if (!open) {
      setSelectedContact(null);
      loadData(); // Refresh data when modal closes
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Statistics with better colors and styling
  const stats = [
    {
      label: 'Total Applications',
      value: applications.length,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      change: '+12% from last month',
      changeColor: 'text-green-600'
    },
    {
      label: 'New Applications',
      value: applications.filter(a => a.status === 'pending').length,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      change: '+8% from 7 days',
      changeColor: 'text-green-600'
    },
    {
      label: 'Contact Messages',
      value: contacts.length,
      icon: MessageSquare,
      gradient: 'from-cyan-500 to-cyan-600',
      change: '+5% from last week',
      changeColor: 'text-green-600'
    },
    {
      label: 'Total Visitors',
      value: '2,450',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600',
      change: 'This month',
      changeColor: 'text-green-600'
    },
  ];

  // Chart data
  const applicationsByType = applications.reduce((acc: any, app) => {
    const type = app.loanProduct || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(applicationsByType).map(([name, value]) => ({
    name,
    value
  }));

  const statusData = [
    { name: 'Pending', value: applications.filter(a => a.status === 'pending').length, fill: 'hsl(38 92% 55%)' },
    { name: 'Approved', value: applications.filter(a => a.status === 'approved').length, fill: 'hsl(142 76% 36%)' },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, fill: 'hsl(0 84% 60%)' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          title="Dashboard Overview" 
          subtitle="Monitor your finance portal performance"
        />

        <main className="flex-1 p-8">
          {dataLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Enhanced Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}></div>
                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                          <p className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Enhanced Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Applications by Status - Bar Chart */}
                <Card className="p-6 border-0 shadow-lg">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">Applications by Status</h3>
                    <p className="text-sm text-muted-foreground">Track approval and rejection rates</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]}
                        animationDuration={1000}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Loan Types - Donut Pie Chart */}
                <Card className="p-6 border-0 shadow-lg">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">Applications by Loan Type</h3>
                    <p className="text-sm text-muted-foreground">Distribution across loan categories</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1000}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Recent Data Tables */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Loan Applications */}
                <Card className="border-0 shadow-lg">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground mb-1">Recent Loan Applications</h3>
                    <p className="text-sm text-muted-foreground">Latest application submissions</p>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Loan Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No applications yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            applications.slice(0, 5).map((app: any) => (
                              <TableRow key={app.id} className="hover:bg-muted/50">
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-foreground">{app.fullName}</p>
                                    <p className="text-xs text-muted-foreground">{app.email}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm font-medium">{app.loanProduct}</span>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      app.status === 'approved' ? 'default' : 
                                      app.status === 'rejected' ? 'destructive' : 
                                      'secondary'
                                    }
                                    className="capitalize"
                                  >
                                    {app.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewApplication(app)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </Card>

                {/* Contact Messages */}
                <Card className="border-0 shadow-lg">
                  <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground mb-1">Recent Contact Messages</h3>
                    <p className="text-sm text-muted-foreground">Customer inquiries and feedback</p>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contacts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No contact submissions yet
                              </TableCell>
                            </TableRow>
                          ) : (
                            contacts.slice(0, 5).map((contact: any) => (
                              <TableRow key={contact.id} className="hover:bg-muted/50">
                                <TableCell>
                                  <div>
                                    <p className="font-medium text-foreground">{contact.name}</p>
                                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">{contact.subject}</span>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={contact.status === 'resolved' ? 'default' : 'secondary'}
                                    className="capitalize"
                                  >
                                    {contact.status || 'pending'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewContact(contact)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <ApplicationDetailModal
        application={selectedApplication}
        open={appModalOpen}
        onOpenChange={handleAppModalClose}
      />
      
      <ContactDetailModal
        contact={selectedContact}
        open={contactModalOpen}
        onOpenChange={handleContactModalClose}
      />
    </div>
  );
};

export default AdminDashboard;
