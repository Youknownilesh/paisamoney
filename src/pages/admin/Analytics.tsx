import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, IndianRupee, Loader2 } from 'lucide-react';
import { onApplicationsChange, ApplicationData } from '@/services/applicationService';

// Color palette for loan types
const LOAN_TYPE_COLORS: Record<string, string> = {
  'Personal Loan': '#FF6B6B',
  'Home Loan': '#4ECDC4',
  'Car Loan': '#45B7D1',
  'Education Loan': '#FFA07A',
  'Business Loan': '#98D8C8',
  'Property Loan': '#9B59B6',
  'Vehicle Loan': '#3498DB',
  'Gold Loan': '#F1C40F',
  // Default color for unknown types
  'default': '#95A5A6'
};

const Analytics = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time application updates
  useEffect(() => {
    const unsubscribe = onApplicationsChange((apps) => {
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate stats from real data
  const calculateStats = () => {
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(app => app.status === 'approved');
    const pendingApplications = applications.filter(app => app.status === 'pending');
    const rejectedApplications = applications.filter(app => app.status === 'rejected');
    
    // Total loan amount granted (approved applications only)
    const totalAmountGranted = approvedApplications.reduce((sum, app) => {
      const amount = parseFloat(app.loanAmount.replace(/[^0-9.]/g, '')) || 0;
      return sum + amount;
    }, 0);

    // Unique users (by email)
    const uniqueUsers = new Set(applications.map(app => app.email.toLowerCase())).size;

    // Approval rate
    const approvalRate = totalApplications > 0 
      ? ((approvedApplications.length / totalApplications) * 100).toFixed(1)
      : '0';

    // Calculate trend (compare current month to previous month)
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthApps = applications.filter(app => {
      const date = app.submittedAt?.toDate?.() || new Date(app.submittedAt as any);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const prevMonthApps = applications.filter(app => {
      const date = app.submittedAt?.toDate?.() || new Date(app.submittedAt as any);
      return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
    });

    const appTrend = prevMonthApps.length > 0 
      ? (((currentMonthApps.length - prevMonthApps.length) / prevMonthApps.length) * 100).toFixed(1)
      : '0';

    return {
      totalAmountGranted,
      totalApplications,
      uniqueUsers,
      approvalRate,
      approvedCount: approvedApplications.length,
      pendingCount: pendingApplications.length,
      rejectedCount: rejectedApplications.length,
      appTrend: parseFloat(appTrend)
    };
  };

  // Generate monthly data for bar chart (last 6 months)
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const monthlyData: { month: string; approved: number; rejected: number; pending: number }[] = [];

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthApps = applications.filter(app => {
        const appDate = app.submittedAt?.toDate?.() || new Date(app.submittedAt as any);
        return appDate.getMonth() === month && appDate.getFullYear() === year;
      });

      monthlyData.push({
        month: months[month],
        approved: monthApps.filter(app => app.status === 'approved').length,
        rejected: monthApps.filter(app => app.status === 'rejected').length,
        pending: monthApps.filter(app => app.status === 'pending').length,
      });
    }

    return monthlyData;
  };

  // Generate loan type distribution for pie chart
  const generateLoanTypeData = () => {
    const loanTypeCounts: Record<string, number> = {};

    applications.forEach(app => {
      const loanType = app.loanProduct || 'Unknown';
      loanTypeCounts[loanType] = (loanTypeCounts[loanType] || 0) + 1;
    });

    return Object.entries(loanTypeCounts).map(([name, value]) => ({
      name,
      value,
      color: LOAN_TYPE_COLORS[name] || LOAN_TYPE_COLORS['default']
    }));
  };

  // Generate amount trend data (monthly approved amounts)
  const generateAmountTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trendData: { month: string; amount: number }[] = [];

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();

      const monthApps = applications.filter(app => {
        const appDate = app.submittedAt?.toDate?.() || new Date(app.submittedAt as any);
        return appDate.getMonth() === month && 
               appDate.getFullYear() === year && 
               app.status === 'approved';
      });

      const totalAmount = monthApps.reduce((sum, app) => {
        const amount = parseFloat(app.loanAmount.replace(/[^0-9.]/g, '')) || 0;
        return sum + amount;
      }, 0);

      trendData.push({
        month: months[month],
        amount: totalAmount,
      });
    }

    return trendData;
  };

  // Format currency in Indian format
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format Y-axis for amount chart
  const formatYAxis = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading analytics data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const monthlyData = generateMonthlyData();
  const loanTypeData = generateLoanTypeData();
  const amountTrendData = generateAmountTrendData();

  const statsCards = [
    { 
      label: 'Total Amount Granted', 
      value: formatCurrency(stats.totalAmountGranted), 
      icon: IndianRupee, 
      trend: `${stats.approvedCount} approved loans`, 
      color: 'from-green-500 to-emerald-600',
      trendColor: 'text-green-600'
    },
    { 
      label: 'Total Applications', 
      value: stats.totalApplications.toLocaleString(), 
      icon: FileText, 
      trend: stats.appTrend >= 0 ? `+${stats.appTrend}%` : `${stats.appTrend}%`, 
      color: 'from-blue-500 to-cyan-600',
      trendColor: stats.appTrend >= 0 ? 'text-green-600' : 'text-red-600'
    },
    { 
      label: 'Unique Applicants', 
      value: stats.uniqueUsers.toLocaleString(), 
      icon: Users, 
      trend: `${stats.pendingCount} pending`, 
      color: 'from-purple-500 to-pink-600',
      trendColor: 'text-amber-600'
    },
    { 
      label: 'Approval Rate', 
      value: `${stats.approvalRate}%`, 
      icon: TrendingUp, 
      trend: `${stats.rejectedCount} rejected`, 
      color: 'from-orange-500 to-red-600',
      trendColor: 'text-red-600'
    },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Real-time insights from {stats.totalApplications} loan applications
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                        <p className={`text-sm mt-2 ${stat.trendColor}`}>{stat.trend}</p>
                      </div>
                      <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Applications */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Monthly Applications (Last 6 Months)</h3>
                {monthlyData.some(d => d.approved > 0 || d.rejected > 0 || d.pending > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="approved" fill="#22c55e" name="Approved" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No application data available for the last 6 months
                  </div>
                )}
              </Card>

              {/* Loan Type Distribution */}
             <Card className="p-6">
  <h3 className="text-xl font-bold mb-6">Loan Type Distribution</h3>

  {loanTypeData.length > 0 ? (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={loanTypeData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name.replace(" Loan", "")} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          dataKey="value"
        >
          {loanTypeData.map((entry, index) => {
            const colors = [
              "#6366F1", // Personal Loan - Indigo
              "#0EA5E9", // Home Loan - Sky Blue
              "#10B981", // Car Loan - Emerald
              "#F59E0B", // Education Loan - Amber
              "#EF4444", // Business Loan - Red
              "#8B5CF6", // Property Loan - Purple
            ];

            return (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            );
          })}
        </Pie>

        <Tooltip
          formatter={(value: number) => [`${value} applications`, "Count"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
      No loan type data available
    </div>
  )}
</Card>

              {/* Amount Trend */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-xl font-bold mb-6">Approved Loan Amount Trend (Last 6 Months)</h3>
                {amountTrendData.some(d => d.amount > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={amountTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        tickFormatter={formatYAxis}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), 'Amount']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 6 }}
                        activeDot={{ r: 8 }}
                        name="Approved Amount (₹)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No approved loan amounts in the last 6 months
                  </div>
                )}
              </Card>
            </div>

            {/* Summary Table */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedCount}</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.pendingCount}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejectedCount}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
