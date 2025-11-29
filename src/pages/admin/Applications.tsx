import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApplicationDetailModal from '@/components/admin/ApplicationDetailModal';

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // FIX: Changed 'createdAt' to 'submittedAt' to match applicationService.ts
    const q = query(collection(db, 'loan_applications'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
      setFilteredApplications(apps);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = applications.filter((app) =>
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanProduct?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

  const handleStatusUpdate = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'loan_applications', applicationId), { status });
      toast({
        title: 'Status Updated',
        description: `Application ${status} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Handle both Firestore Timestamp and regular Date
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Loan Applications</h1>
                <p className="text-muted-foreground mt-1">Manage and review loan applications</p>
              </div>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or loan type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="px-4 py-2">
                  Total: {filteredApplications.length}
                </Badge>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Applicant</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div>
                              <p className="font-medium">{app.fullName}</p>
                              <p className="text-sm text-muted-foreground">{app.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{app.loanProduct || app.loanType || 'N/A'}</TableCell>
                          <TableCell className="font-semibold">{formatAmount(app.loanAmount)}</TableCell>
                          {/* FIX: Changed 'createdAt' to 'submittedAt' to match applicationService.ts */}
                          <TableCell>{formatDate(app.submittedAt)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(app.status)} variant="outline">
                              {app.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {app.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {app.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                              {app.status || 'pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setModalOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleStatusUpdate(app.id, 'approved')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
};

export default Applications;
