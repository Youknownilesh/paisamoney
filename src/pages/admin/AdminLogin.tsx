import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const { signIn, signOut, user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const hasCheckedAdmin = useRef(false);

  // Effect to handle admin check AFTER sign-in completes
  useEffect(() => {
    // Only run when we're checking admin status and auth state has settled
    if (isCheckingAdmin && !loading && user) {
      // Give a small delay to ensure Firestore check completes
      const checkTimer = setTimeout(() => {
        console.log('Checking admin status - isAdmin:', isAdmin);
        
        if (isAdmin) {
          // User is admin - redirect to dashboard
          toast({
            title: 'Login Successful',
            description: 'Welcome to the admin panel',
          });
          navigate('/admin/dashboard', { replace: true });
        } else {
          // User is NOT admin - sign out and show error
          toast({
            title: 'Access Denied',
            description: 'You do not have admin privileges.',
            variant: 'destructive',
          });
          signOut();
        }
        
        setIsLoading(false);
        setIsCheckingAdmin(false);
      }, 1500); // Wait 1.5s for Firestore check to complete
      
      return () => clearTimeout(checkTimer);
    }
  }, [isCheckingAdmin, loading, user, isAdmin, toast, navigate, signOut]);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin && !isCheckingAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, isAdmin, loading, navigate, isCheckingAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFirebaseConfigured) {
      toast({
        title: 'Configuration Error',
        description: 'Firebase is not properly configured. Please check your environment variables.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    hasCheckedAdmin.current = false;

    try {
      // Step 1: Sign in user FIRST (this triggers onAuthStateChanged)
      console.log('Signing in user:', email);
      await signIn(email, password);
      
      // Step 2: Set flag to check admin status after auth state updates
      setIsCheckingAdmin(true);
      // The useEffect above will handle the rest
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = 'Invalid credentials';
      
      if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error?.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
        errorMessage = 'Incorrect email or password';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error?.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setIsLoading(false);
      setIsCheckingAdmin(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Sign in to access dashboard</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Firebase Not Configured</p>
              <p className="text-xs text-destructive/80 mt-1">
                Please configure your Firebase environment variables in the .env file.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCheckingAdmin ? 'Verifying Admin Status...' : 'Signing In...'}
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
