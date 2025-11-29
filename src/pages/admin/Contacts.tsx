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
import { Search, Eye, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ContactDetailModal from '@/components/admin/ContactDetailModal';

const Contacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'contact_submissions'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsList);
      setFilteredContacts(contactsList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const handleStatusUpdate = async (contactId: string, status: 'read' | 'resolved') => {
    try {
      await updateDoc(doc(db, 'contact_submissions', contactId), { status });
      toast({
        title: 'Status Updated',
        description: `Contact marked as ${status}`,
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
      case 'resolved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'read': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
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
                <h1 className="text-3xl font-bold text-foreground">Contact Messages</h1>
                <p className="text-muted-foreground mt-1">Manage customer inquiries and messages</p>
              </div>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="px-4 py-2">
                  Total: {filteredContacts.length}
                </Badge>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{contact.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{contact.subject}</p>
                        </TableCell>
                        <TableCell>{formatDate(contact.submittedAt)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contact.status)} variant="outline">
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedContact(contact);
                                setModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {contact.status === 'new' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleStatusUpdate(contact.id, 'read')}
                              >
                                Mark Read
                              </Button>
                            )}
                            {contact.status === 'read' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleStatusUpdate(contact.id, 'resolved')}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
};

export default Contacts;
