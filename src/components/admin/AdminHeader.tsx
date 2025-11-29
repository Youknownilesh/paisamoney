import { useState } from 'react';
import { Bell, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

const AdminHeader = ({ title, subtitle }: AdminHeaderProps = {}) => {
  const { adminName, user } = useAuth();
  const { totalCount, recentNotifications, newApplicationsCount, newContactsCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Just now';
    }
  };

  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome back, {adminName || 'Admin'}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <div className="flex gap-2 text-xs">
                  {newApplicationsCount > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {newApplicationsCount} Applications
                    </span>
                  )}
                  {newContactsCount > 0 && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {newContactsCount} Messages
                    </span>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {recentNotifications.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={`${notification.type}-${notification.id}`}
                      className="flex items-start gap-3 p-3 cursor-pointer"
                    >
                      <div className={`p-2 rounded-full ${
                        notification.type === 'application' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {notification.type === 'application' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {notification.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-primary font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-secondary">
              <AvatarFallback className="bg-transparent text-white font-semibold">
                {adminName ? getInitials(adminName) : 'AD'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-foreground">
                {adminName || 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
