import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerList, { Customer } from "@/components/CustomerList";
import ChurnGauge from "@/components/ChurnGauge";
import ProfileDetails, { ProfileData } from "@/components/ProfileDetails";
import { useToast } from "@/hooks/use-toast";

const mockCustomers: Customer[] = [
  { id: "1", name: "John Anderson", profileId: "P001" },
  { id: "2", name: "Sarah Mitchell", profileId: "P002" },
  { id: "3", name: "Michael Chen", profileId: "P003" },
  { id: "4", name: "Emily Davis", profileId: "P004" },
  { id: "5", name: "Robert Wilson", profileId: "P005" },
  { id: "6", name: "Jennifer Brown", profileId: "P006" },
  { id: "7", name: "David Taylor", profileId: "P007" },
  { id: "8", name: "Lisa Martinez", profileId: "P008" },
];

const getDefaultProfileData = (): ProfileData => ({
  age: 42,
  gender: "Male",
  income: 75000,
  tenure: 36,
  serviceType: "Premium",
  monthlySpend: 1250,
  autoPay: true,
  supportCalls: 3,
  lastInteraction: "Within a week",
});

const calculateChurnRisk = (data: ProfileData): number => {
  let risk = 30;

  // Age factor
  if (data.age < 25) risk += 10;
  else if (data.age > 60) risk += 5;

  // Tenure factor
  if (data.tenure < 12) risk += 20;
  else if (data.tenure < 24) risk += 10;
  else if (data.tenure > 48) risk -= 10;

  // Service type
  if (data.serviceType === "Basic") risk += 15;
  else if (data.serviceType === "Premium") risk -= 10;

  // Auto-pay
  if (!data.autoPay) risk += 10;

  // Support calls
  if (data.supportCalls > 5) risk += 15;
  else if (data.supportCalls > 3) risk += 8;
  else if (data.supportCalls === 0) risk -= 5;

  // Last interaction
  if (data.lastInteraction === "Over 3 months") risk += 20;
  else if (data.lastInteraction === "Within a month") risk += 5;
  else if (data.lastInteraction === "Within 24 hours") risk -= 5;

  // Monthly spend to income ratio
  const spendRatio = (data.monthlySpend * 12) / data.income;
  if (spendRatio > 0.3) risk += 10;
  else if (spendRatio < 0.1) risk += 5;

  return Math.max(0, Math.min(100, risk));
};

const CustomerProfiles = () => {
  const [searchParams] = useSearchParams();
  const domain = searchParams.get("domain") || "insurance";
  const { toast } = useToast();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(mockCustomers[0]);
  const [profileData, setProfileData] = useState<ProfileData>(getDefaultProfileData());
  const [churnRisk, setChurnRisk] = useState(38);

  const domainLabel = useMemo(() => {
    const labels: Record<string, string> = {
      insurance: "Insurance",
      "credit-card": "Credit Card",
      isp: "ISP",
      // equity: "Equity Trading",
    };
    return labels[domain] || "Insurance";
  }, [domain]);

  const handleRunPrediction = () => {
    const calculatedRisk = calculateChurnRisk(profileData);
    setChurnRisk(calculatedRisk);
    toast({
      title: "Prediction Complete",
      description: `Churn risk calculated: ${calculatedRisk}%`,
    });
  };

  const handleReset = () => {
    setProfileData(getDefaultProfileData());
    setChurnRisk(38);
    toast({
      title: "Reset Complete",
      description: "Profile data has been reset to defaults.",
    });
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      {/* Custom Navbar for Profiles */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/favicon.ico"
                alt="Churn Prediction Logo"
                className="w-8 h-8"
              />
              <span className="text-lg font-semibold text-foreground">Churn Prediction</span>
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>←</span>
              <span>Back to Domain Selection</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8">
            Customer Profile
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Customer List */}
            <div className="lg:col-span-1 h-[600px]">
              <CustomerList
                customers={mockCustomers}
                selectedId={selectedCustomer?.id || null}
                onSelect={setSelectedCustomer}
              />
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedCustomer && (
                <>
                  {/* Customer Header Card */}
                  <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-icon-blue/20 flex items-center justify-center">
                          <span className="text-xl font-bold text-icon-blue">
                            {selectedCustomer.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">{selectedCustomer.name}</h2>
                          <p className="text-sm text-muted-foreground">Profile ID: {selectedCustomer.profileId}</p>
                          <Link to="#" className="text-sm text-primary hover:underline">See Details</Link>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Prediction Date</p>
                        <p className="font-semibold text-foreground">{today}</p>
                      </div>
                    </div>
                  </div>

                  {/* Churn Prediction Gauge */}
                  <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                    <h3 className="text-xl font-semibold text-foreground text-center mb-4">Churn Prediction</h3>
                    <ChurnGauge value={churnRisk} />
                  </div>

                  {/* Profile Details */}
                  <ProfileDetails
                    customerName={selectedCustomer.name}
                    profileId={selectedCustomer.profileId}
                    data={profileData}
                    onChange={setProfileData}
                  />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleRunPrediction} size="lg" className="flex-1">
                      Run Prediction
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg" className="flex-1">
                      Reset
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerProfiles;
