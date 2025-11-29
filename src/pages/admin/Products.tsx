import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';

const Products = () => {
  const loanProducts = [
    { id: 1, name: 'Personal Loan', interestRate: '10.5%', maxAmount: '₹15,00,000', tenure: '1-5 years', active: true },
    { id: 2, name: 'Home Loan', interestRate: '8.5%', maxAmount: '₹1,00,00,000', tenure: '5-30 years', active: true },
    { id: 3, name: 'Car Loan', interestRate: '9.0%', maxAmount: '₹25,00,000', tenure: '1-7 years', active: true },
    { id: 4, name: 'Education Loan', interestRate: '8.0%', maxAmount: '₹50,00,000', tenure: '5-15 years', active: true },
    { id: 5, name: 'Business Loan', interestRate: '11.5%', maxAmount: '₹50,00,000', tenure: '1-10 years', active: true },
    { id: 6, name: 'Property Loan', interestRate: '9.5%', maxAmount: '₹2,00,00,000', tenure: '5-25 years', active: false },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Loan Products</h1>
                <p className="text-muted-foreground mt-1">Manage loan products and offerings</p>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loanProducts.map((product) => (
                <Card key={product.id} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={product.active ? 'default' : 'secondary'}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4">{product.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Interest Rate</span>
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {product.interestRate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Max Amount</span>
                      <span className="font-semibold">{product.maxAmount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tenure</span>
                      <span className="font-semibold">{product.tenure}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
