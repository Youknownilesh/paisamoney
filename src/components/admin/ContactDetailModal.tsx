import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ContactSubmission, updateContactStatus } from '@/services/contactService';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  CheckCircle2,
  Eye,
  FileText
} from 'lucide-react';
import { useState } from 'react';

interface ContactDetailModalProps {
  contact: ContactSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDetailModal = ({ contact, open, onOpenChange }: ContactDetailModalProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!contact) return null;

  const handleStatusUpdate = async (status: 'read' | 'resolved') => {
    if (!contact.id) return;
    
    setIsUpdating(true);
    try {
      await updateContactStatus(contact.id, status);
      toast({
        title: status === 'read' ? '👁️ Marked as Read' : '✅ Marked as Resolved',
        description: `Contact from ${contact.name} has been marked as ${status}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contact status',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'read': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'read': return 'Read';
      default: return 'New';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Contact Submission
            </DialogTitle>
            <Badge className={`${getStatusColor(contact.status)} border`}>
              {getStatusLabel(contact.status)}
            </Badge>
          </div>
          <DialogDescription>
            Received on {formatDate(contact.submittedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-3 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{contact.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{contact.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Message
            </h3>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold text-primary mb-2">{contact.subject}</p>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{contact.message}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {contact.status === 'new' && (
            <>
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate('read')}
                disabled={isUpdating}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Mark as Read
              </Button>
              <Button
                onClick={() => handleStatusUpdate('resolved')}
                disabled={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Resolved
              </Button>
            </>
          )}
          {contact.status === 'read' && (
            <Button
              onClick={() => handleStatusUpdate('resolved')}
              disabled={isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Resolved
            </Button>
          )}
          {contact.status === 'resolved' && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailModal;
