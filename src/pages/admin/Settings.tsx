import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Save, Lock, Wrench, AlertTriangle, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMaintenance } from '@/contexts/MaintenanceContext';
import { auth } from '@/lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isMaintenanceMode, maintenanceMessage, setMaintenanceMode, loading: maintenanceLoading } = useMaintenance();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Maintenance mode state
  const [tempMaintenanceMessage, setTempMaintenanceMessage] = useState(maintenanceMessage);
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    if (strength <= 2) return { strength: 40, label: 'Weak', color: 'bg-red-500' };
    if (strength === 3) return { strength: 60, label: 'Fair', color: 'bg-yellow-500' };
    if (strength === 4) return { strength: 80, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const passwordsMismatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    if (!user || !auth.currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to change your password",
        variant: "destructive"
      });
      return;
    }

    setPasswordLoading(true);
    
    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Update password
      await updatePassword(auth.currentUser, newPassword);
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully",
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      
      let errorMessage = "Failed to update password";
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Current password is incorrect";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "New password is too weak. Please choose a stronger password";
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Please log out and log back in, then try again";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle maintenance mode toggle
  const handleMaintenanceToggle = async (enabled: boolean) => {
    setMaintenanceSaving(true);
    try {
      await setMaintenanceMode(enabled, tempMaintenanceMessage);
      toast({
        title: enabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
        description: enabled 
          ? "Public users will now see the maintenance page" 
          : "Website is now accessible to all users",
      });
    } catch (error) {
      console.error('Maintenance mode error:', error);
      toast({
        title: "Error",
        description: "Failed to update maintenance mode",
        variant: "destructive"
      });
    } finally {
      setMaintenanceSaving(false);
    }
  };

  // Save maintenance message
  const handleSaveMaintenanceMessage = async () => {
    setMaintenanceSaving(true);
    try {
      await setMaintenanceMode(isMaintenanceMode, tempMaintenanceMessage);
      toast({
        title: "Success",
        description: "Maintenance message updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update maintenance message",
        variant: "destructive"
      });
    } finally {
      setMaintenanceSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage security and site settings</p>
            </div>

            {/* Password Change Section */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your admin account password</p>
                </div>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="newPassword" 
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.strength <= 40 ? 'text-red-500' :
                          passwordStrength.strength <= 60 ? 'text-yellow-500' :
                          passwordStrength.strength <= 80 ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use 8+ characters with uppercase, lowercase, numbers & symbols
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className={`pr-10 ${passwordsMatch ? 'border-green-500' : ''} ${passwordsMismatch ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className="flex items-center gap-1">
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-red-500">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword || passwordsMismatch}
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* Maintenance Mode Section */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground">Control public access to your website</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Warning Banner */}
                {isMaintenanceMode && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">Maintenance Mode is Active</p>
                      <p className="text-sm text-orange-700">
                        Public users cannot access the website. Only admin panel is accessible.
                      </p>
                    </div>
                  </div>
                )}

                {/* Toggle Switch */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Enable Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, visitors will see a maintenance page
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {maintenanceLoading || maintenanceSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        isMaintenanceMode 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {isMaintenanceMode ? 'ON' : 'OFF'}
                      </span>
                    )}
                    <Switch 
                      checked={isMaintenanceMode}
                      onCheckedChange={handleMaintenanceToggle}
                      disabled={maintenanceLoading || maintenanceSaving}
                    />
                  </div>
                </div>

                <Separator />

                {/* Custom Message */}
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Custom Maintenance Message (Optional)</Label>
                  <Textarea 
                    id="maintenanceMessage"
                    placeholder="We're currently performing scheduled maintenance. We'll be back shortly!"
                    value={tempMaintenanceMessage}
                    onChange={(e) => setTempMaintenanceMessage(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be displayed to visitors on the maintenance page
                  </p>
                </div>

                <Button 
                  onClick={handleSaveMaintenanceMessage}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={maintenanceSaving}
                >
                  {maintenanceSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Maintenance Message
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
