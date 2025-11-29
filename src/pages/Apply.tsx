import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { submitApplication } from "@/services/applicationService";

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  loanProduct: string;
  loanAmount: string;
  loanTenure: string;
  employmentType: string;
  monthlyIncome: string;
  companyName: string;
}

const mockLoanProducts = [
  { id: "1", name: "Personal Loan - Fast Approval" },
  { id: "2", name: "Home Loan - Low Interest" },
  { id: "3", name: "Education Loan - Student Friendly" },
  { id: "4", name: "Business Loan - Growth Capital" },
  { id: "5", name: "Vehicle Loan - New & Used" },
  { id: "6", name: "Property Loan - Commercial" },
];

const Apply = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ApplicationFormData>();

  const { data: loanProducts } = useQuery({
    queryKey: ["loan-products"],
    queryFn: async () => mockLoanProducts,
  });

  // Pre-fill loan product if coming from a specific loan page
  useEffect(() => {
    if (id && loanProducts) {
      setValue("loanProduct", id);
    }
  }, [id, loanProducts, setValue]);

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    try {
      await submitApplication(data);
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Our team will contact you soon to process your loan application.",
      });
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later. Make sure Firebase is configured correctly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary to-secondary py-12 text-primary-foreground">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Loan Application</h1>
            <p className="text-lg text-primary-foreground/90">Fill out the form below to apply for a loan</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName", { required: "Full name is required" })}
                      placeholder="John Doe"
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="john@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Phone must be 10 digits",
                        },
                      })}
                      placeholder="9876543210"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth", { required: "Date of birth is required" })}
                      className={errors.dateOfBirth ? "border-destructive" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-destructive mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      {...register("address", { required: "Address is required" })}
                      placeholder="123 Main Street"
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      placeholder="Mumbai"
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...register("state", { required: "State is required" })}
                      placeholder="Maharashtra"
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      {...register("pincode", {
                        required: "Pincode is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Pincode must be 6 digits",
                        },
                      })}
                      placeholder="400001"
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Loan Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanProduct">Loan Product *</Label>
                    <Select
                      onValueChange={(value) => setValue("loanProduct", value)}
                      {...register("loanProduct", { required: "Please select a loan product" })}
                      value={watch("loanProduct")}
                      disabled={!!id}
                    >
                      <SelectTrigger className={errors.loanProduct ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanProducts?.map((product) => (
                          <SelectItem key={product.id} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {id && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Loan product is pre-selected based on your choice
                      </p>
                    )}
                    {errors.loanProduct && (
                      <p className="text-sm text-destructive mt-1">{errors.loanProduct.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="loanAmount">Amount Requested (₹) *</Label>
                    <Input
                      id="loanAmount"
                      {...register("loanAmount", {
                        required: "Amount is required",
                      })}
                      placeholder="500000"
                      className={errors.loanAmount ? "border-destructive" : ""}
                    />
                    {errors.loanAmount && (
                      <p className="text-sm text-destructive mt-1">{errors.loanAmount.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="loanTenure">Tenure (months) *</Label>
                    <Input
                      id="loanTenure"
                      {...register("loanTenure", {
                        required: "Tenure is required",
                      })}
                      placeholder="24"
                      className={errors.loanTenure ? "border-destructive" : ""}
                    />
                    {errors.loanTenure && (
                      <p className="text-sm text-destructive mt-1">{errors.loanTenure.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment & Income */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Employment & Income</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">Employment Type *</Label>
                    <Select
                      onValueChange={(value) => setValue("employmentType", value)}
                      {...register("employmentType", { required: "Please select employment type" })}
                    >
                      <SelectTrigger className={errors.employmentType ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salaried">Salaried</SelectItem>
                        <SelectItem value="self-employed">Self-employed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.employmentType && (
                      <p className="text-sm text-destructive mt-1">{errors.employmentType.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                    <Input
                      id="monthlyIncome"
                      {...register("monthlyIncome", {
                        required: "Monthly income is required",
                      })}
                      placeholder="50000"
                      className={errors.monthlyIncome ? "border-destructive" : ""}
                    />
                    {errors.monthlyIncome && (
                      <p className="text-sm text-destructive mt-1">{errors.monthlyIncome.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      {...register("companyName")}
                      placeholder="ABC Corporation"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Apply;
