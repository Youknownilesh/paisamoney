import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApplicationData, updateApplicationStatus } from '@/services/applicationService';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  IndianRupee,
  Building2,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { useState } from 'react';

interface ApplicationDetailModalProps {
  application: ApplicationData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationDetailModal = ({ application, open, onOpenChange }: ApplicationDetailModalProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!application) return null;

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (!application.id) return;
    
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, status);
      toast({
        title: status === 'approved' ? '✅ Application Approved' : '❌ Application Rejected',
        description: `${application.fullName}'s application has been ${status}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.toDate) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return `₹${parseInt(amount || '0').toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Loan Application Details
            </DialogTitle>
            <Badge className={`${getStatusColor(application.status)} border`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
          <DialogDescription>
            Submitted on {formatDate(application.submittedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium">{application.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{application.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{application.dateOfBirth}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </h3>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="font-medium">{application.address}</p>
              <p className="text-muted-foreground">
                {application.city}, {application.state} - {application.pincode}
              </p>
            </div>
          </div>

          <Separator />

          {/* Loan Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Loan Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">Loan Type</p>
                <p className="font-semibold text-lg">{application.loanProduct}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 rounded-lg border border-emerald-500/20">
                <p className="text-xs text-muted-foreground">Loan Amount</p>
                <p className="font-semibold text-lg text-emerald-600">{formatAmount(application.loanAmount)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-lg border border-blue-500/20">
                <p className="text-xs text-muted-foreground">Tenure</p>
                <p className="font-semibold text-lg">{application.loanTenure}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Employment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Employment Type</p>
                  <p className="font-medium">{application.employmentType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Income</p>
                  <p className="font-medium">{formatAmount(application.monthlyIncome)}</p>
                </div>
              </div>
              {application.companyName && (
                <div className="flex items-center gap-3 md:col-span-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Company Name</p>
                    <p className="font-medium">{application.companyName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {application.status === 'pending' && (
            <>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Application
              </Button>
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve Application
              </Button>
            </>
          )}
          {application.status !== 'pending' && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailModal;
